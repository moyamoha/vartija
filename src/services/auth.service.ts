import { MailerService } from '@nestjs-modules/mailer';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { UserDocument } from 'src/schemas/user.schema';
import { UserService } from './user.service';
import { randomPass } from 'src/utils/random';
import { CreateUserDto } from 'src/utils/dtos/user';
import { WRONG_VERIFICATION_CODE } from 'src/utils/constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
    this.mailerService.sendMail({
      from: process.env.EMAIL_SENDER,
      to: user.email,
      subject: 'Reset password',
      html: `<p><strong>Dear ${user.firstname}!</strong><br></br>Use this password: <strong>${randomPassword}</strong> to log in. Please make sure to change it after you log in </strong>
      <br></br><i>Team Guardian.</i></p>`,
    });
  }

  generateOtp(user: UserDocument) {
    speakeasy.totp({
      secret: user.mfa.userSecret,
      encoding: 'base32',
    });
  }
}
