import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import * as speakeasy from 'speakeasy';

import { User, UserDocument } from 'src/schemas/user.schema';
import { DUPLICATE_EMAIL } from 'src/utils/constants';
import { throwNotFoundError } from 'src/utils/utility-functions';
import { ChangeNamePayload, CreateUserDto } from 'src/utils/dtos/user';
import { Category, CategoryDocument } from 'src/schemas/category.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private eventEmitter: EventEmitter2,
  ) {}

  async createUser(userObj: CreateUserDto): Promise<UserDocument> {
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
        throw new BadRequestException(DUPLICATE_EMAIL);
      } else {
        throw new BadRequestException(e, e.message);
      }
    }
    this.eventEmitter.emit('user.created', created);
    return created;
  }
  async findOneByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email: email });
    if (!user) throwNotFoundError('User', email);
    return user;
  }

  async deactivate(user: UserDocument, password: string) {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestException('Incorrect password');
    }
    try {
      user.isActive = false;
      this.eventEmitter.emit('user.deactivated', user);
      await user.save();
    } catch (e) {}
  }

  async deleteAccount(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    this.eventEmitter.emit('user.deleted', user);
  }

  async confirmEmail(id: string): Promise<string> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throwNotFoundError('User', id);
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
      this.eventEmitter.emit('user.disabled-mfa', updated);
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
      this.eventEmitter.emit('user.enabled-mfa', updated);
      await this.cacheManager.del(updated._id + '_temp_secret');
      return updated;
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }

  async changeName(user: UserDocument, body: ChangeNamePayload): Promise<void> {
    user.firstname = body.firstname;
    user.lastname = body.lastname;
    try {
      await user.save();
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

  async getUserData(user: UserDocument) {
    const categories = await this.categoryModel
      .find({ owner: user._id })
      .populate('items');
    return categories;
  }
}
