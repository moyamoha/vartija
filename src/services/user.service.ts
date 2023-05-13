import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import * as speakeasy from 'speakeasy';

import { User, UserDocument } from 'src/schemas/user.schema';
import {
  mfaDisabledEmailResp,
  accountDeactivedEmailResp,
  accountDeletedEmailResp,
  mfaEnabledEmailResp,
} from 'src/utils/constants';
import { throwNotFoundError } from 'src/utils/utility-functions';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getProfileUpdateEventPayload } from 'src/utils/random';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailerService: MailerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly eventEmitter: EventEmitter2,
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
    return created;
  }
  async findOneByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email: email });
    if (!user) throwNotFoundError('User', user.email);
    return user;
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
      const updated = await user.save();
      this.eventEmitter.emit(
        'profile-update',
        getProfileUpdateEventPayload(updated),
      );
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

  async disableMfa(user: UserDocument): Promise<UserDocument> {
    try {
      user.mfa = { enabled: false, userSecret: '' };
      const updated = await user.save();
      await this.mailerService.sendMail({
        from: process.env.EMAIL_SENDER,
        to: updated.email,
        subject: 'Oops! your account is VULNERABLE',
        html: `<p><strong>Dear ${updated.firstname}!</strong><br></br>${mfaDisabledEmailResp}
        <br></br><i>Team Guardian.</i></p>`,
      });
      this.eventEmitter.emit(
        'profile-update',
        getProfileUpdateEventPayload(updated),
      );
      return updated;
    } catch (error) {
      throw new BadRequestException('Could not update user');
    }
  }

  async enableMfa(user: UserDocument, token: string): Promise<UserDocument> {
    try {
      const secret = (await this.cacheManager.get(
        user._id + '_temp_secret',
      )) as string;
      const verified = speakeasy.totp.verify({
        token: token,
        secret: secret,
        encoding: 'base32',
      });
      if (!verified) {
        throw new BadRequestException('Wrong password');
      }
      user.mfa = { enabled: true, userSecret: secret };
      const updated = await user.save();
      await this.mailerService.sendMail({
        from: process.env.EMAIL_SENDER,
        to: updated.email,
        subject: 'Your account is now SECURE',
        html: `<p><strong>Dear ${updated.firstname}!</strong><br></br>${mfaEnabledEmailResp}
        <br></br><i>Team Guardian.</i></p>`,
      });
      await this.cacheManager.del(updated._id + '_temp_secret');
      this.eventEmitter.emit(
        'profile-update',
        getProfileUpdateEventPayload(updated),
      );
      return updated;
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }

  async changeName(
    user: UserDocument,
    body: { firstname: string; lastname: string },
  ): Promise<void> {
    user.firstname = body.firstname;
    user.lastname = body.lastname;
    try {
      const updated = await user.save();
      this.eventEmitter.emit(
        'profile-update',
        getProfileUpdateEventPayload(updated),
      );
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
      const isMatch = await bcrypt.compare(body.currentPassword, user.password);
      if (!isMatch) {
        throw new BadRequestException('Current password is incorrect');
      }
      user.password = await bcrypt.hash(body.newPassword, 10);
      await user.save({ validateBeforeSave: false });
    } catch (e) {
      throw new BadRequestException(e, e.message);
    }
  }

  async findUserByCode(code: number): Promise<UserDocument> {
    return await this.userModel.findOne({ verificationCode: code });
  }

  async getQrCodeUrl(user: UserDocument): Promise<string> {
    const secret = speakeasy.generateSecret({
      name: 'Guardian',
      issuer: 'Guardian',
    });
    await this.cacheManager.set(user._id + '_temp_secret', secret.base32, 0);
    return secret.otpauth_url;
  }
}
