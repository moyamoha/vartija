import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';

import { UserDocument } from 'src/schemas/user.schema';
import { UserService } from './user.service';
import { randomPass } from 'src/utils/random';
import { CreateUserDto } from 'src/utils/dtos/user';
import { WRONG_VERIFICATION_CODE } from 'src/utils/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TempPasswordEvent } from 'src/events/user.events';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}

  async login(user: UserDocument): Promise<{ accessToken: string }> {
    user.lastLoggedIn = new Date();
    if (!user.isActive) {
      user.isActive = true;
    }
    const payload = {
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      mfaEnabled: user.mfa.enabled,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    await user.save();
    return { accessToken };
  }

  async validateUser(email: string, pass: string): Promise<UserDocument> {
    const user = await this.userService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return user;
    }
    return null;
  }

  async singup(userObj: CreateUserDto) {
    await this.userService.createUser(userObj);
  }

  async verifyLogin(
    userEmail: string,
    token: string,
  ): Promise<{ accessToken: string }> {
    const foundUser = await this.userService.findOneByEmail(userEmail);
    const secret = foundUser.mfa.userSecret;
    const verified = speakeasy.totp.verify({
      secret: secret,
      token: token,
      encoding: 'base32',
    });
    if (verified) {
      await foundUser.save();
      return this.login(foundUser);
    } else {
      throw new UnauthorizedException(WRONG_VERIFICATION_CODE);
    }
  }

  async sendTemporaryPassword(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('Email not associated to any user');
    }
    const randomPassword = randomPass() + randomPass();
    user.password = await bcrypt.hash(randomPassword, 10);
    await user.save();
    const tempPassEvent = new TempPasswordEvent(user, randomPassword);
    await this.eventEmitter.emitAsync('send-temp-password', tempPassEvent);
  }

  generateOtp(user: UserDocument) {
    speakeasy.totp({
      secret: user.mfa.userSecret,
      encoding: 'base32',
    });
  }
}
