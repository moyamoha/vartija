import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import {
  UserActivity,
  UserActivityDocument,
} from 'src/schemas/user-activity.schema';

import { User, UserDocument } from 'src/schemas/user.schema';
import {
  mfaDisabledEmailResp,
  accountDeactivedEmailResp,
  accountDeletedEmailResp,
  mfaEnabledEmailResp,
  ACTIVITY_TYPES,
} from 'src/utils/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserActivity.name)
    private userActivityModel: Model<UserActivity>,
    private mailerService: MailerService,
  ) {}

  async createUser(userObj: Partial<UserDocument>): Promise<UserDocument> {
    let created: UserDocument;
    try {
      const mockUser = new this.userModel(userObj);
      await mockUser.validate();
      const hashedPassoword = await bcrypt.hash(userObj.password, 10);
      const newUser = new this.userModel({
        ...userObj,
        password: hashedPassoword,
        lastLoggedIn: null,
      }) as UserDocument;

      created = await newUser.save({ validateBeforeSave: false });
    } catch (e) {
      if (e.code === 11000) {
        throw new BadRequestException('Email address is already taken');
      } else {
        throw new BadRequestException(e, e.message);
      }
    }
    const confirmationLink = `${process.env.SITE_ADDRESS}/users/confirm/?id=${created._id}`;
    await this.mailerService.sendMail({
      from: process.env.EMAIL_SENDER,
      to: created.email,
      text: 'Welcome to Guardian',
      subject: 'Welcome to Guardian',
      html: `<p><strong>Dear ${created.firstname}!</strong><br></br>We are glad you chose Guardian to keep your passwords safe and secure. 
      Before you can do anything, please confirm your email address by clicking <a href="${confirmationLink}">This link</a>
      <br></br><i>Team Guardian.</i></p>`,
    });
    await new this.userActivityModel({
      user: created._id,
      activity: ACTIVITY_TYPES.REGISTER,
      timestamp: new Date(),
    }).save();
    return created;
  }
  async findOneByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email: email });
  }

  async deactivate(user: UserDocument) {
    try {
      user.isActive = false;
      await this.mailerService.sendMail({
        from: process.env.EMAIL_SENDER,
        to: user.email,
        subject: 'Your account is DEACTIVATED',
        html: `<p><strong>Dear ${user.firstname}!</strong><br></br>${accountDeactivedEmailResp}
        <br></br><i>Team Guardian.</i></p>`,
      });
      await user.save();
      await new this.userActivityModel({
        userId: user._id,
        activity: ACTIVITY_TYPES.DEACTIVATE_ACCOUNT,
        timestamp: new Date(),
      }).save();
    } catch (e) {}
  }

  async deleteAccount(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    await this.mailerService.sendMail({
      from: process.env.EMAIL_SENDER,
      to: user.email,
      subject: 'Your account was DELETED',
      html: `<p><strong>Dear ${user.firstname}!</strong><br></br>${accountDeletedEmailResp}
      <br></br><i>Team Guardian.</i></p>`,
    });
    await new this.userActivityModel({
      userId: user._id,
      activityType: ACTIVITY_TYPES.DELETE_ACCOUNT,
      timestamp: new Date(),
    }).save();
  }

  async confirmEmail(id: string): Promise<string> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} was not found`);
    }
    user.emailConfirmed = true;
    await user.save();
    return 'You are all set. Enjoy using our application ❤️';
  }

  async getInActives(): Promise<UserDocument[]> {
    return await this.userModel.find({ isActive: false });
  }

  async changeMfaState(id: string, mfaEnabled: boolean): Promise<UserDocument> {
    try {
      const updated = await this.userModel.findByIdAndUpdate(
        id,
        { mfaEnabled: mfaEnabled },
        { returnDocument: 'after' },
      );
      const bodyText = mfaEnabled ? mfaEnabledEmailResp : mfaDisabledEmailResp;
      await this.mailerService.sendMail({
        from: process.env.EMAIL_SENDER,
        to: updated.email,
        subject: mfaEnabled
          ? 'Your account is now SECURE'
          : 'Oops! your account is VULNERABLE',
        html: `<p><strong>Dear ${updated.firstname}!</strong><br></br>${bodyText}
        <br></br><i>Team Guardian.</i></p>`,
      });
      const activityType = mfaEnabled
        ? ACTIVITY_TYPES.ENABLE_2FA
        : ACTIVITY_TYPES.DISABLE_2FA;
      await new this.userActivityModel({
        userId: updated._id,
        activityType: activityType,
        timestamp: new Date(),
      }).save();
      return updated;
    } catch (e) {
      throw new BadRequestException('Could not update user');
    }
  }

  async changeName(
    user: UserDocument,
    body: { firstname: string; lastname: string },
  ): Promise<void> {
    user.firstname = body.firstname;
    user.lastname = body.lastname;
    try {
      await user.save();
      await new this.userActivityModel({
        userId: user._id,
        activityType: ACTIVITY_TYPES.CHANGE_NAME,
        timestamp: new Date(),
      }).save();
    } catch (e) {
      throw new BadRequestException(e, e.message);
    }
  }

  async changePassword(
    user: UserDocument,
    body: { currentPassword: string; newPassword: string },
  ) {
    try {
      const mockUser = new this.userModel({
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        password: body.newPassword,
      });
      await mockUser.validate();
      user.password = await bcrypt.hash(body.newPassword, 10);
      await user.save({ validateBeforeSave: false });
      await new this.userActivityModel({
        userId: user._id,
        activityType: ACTIVITY_TYPES.CHANGE_PASSWORD,
        timestamp: new Date(),
      }).save();
    } catch (e) {
      throw new BadRequestException(e, e.message);
    }
  }

  async findUserByCode(code: number): Promise<UserDocument> {
    return await this.userModel.findOne({ verificationCode: code });
  }

  async getActivityHistory(userId: string): Promise<UserActivityDocument[]> {
    let history = [];
    history = await this.userActivityModel
      .find({ userId: userId })
      .sort({ timestamp: -1 });
    return history;
  }

  async clearActivityHistory(userId: string): Promise<void> {
    await this.userActivityModel.deleteMany({ userId: userId });
  }
}
