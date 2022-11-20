import { MailerService } from '@nestjs-modules/mailer';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

import { UserDocument } from 'src/schemas/user.schema';
import { UserService } from './user.service';
import { randomPass } from 'src/utils/random';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async login(user: UserDocument): Promise<{ accessToken: string }> {
    user.lastLoggedIn = new Date();
    if (!user.isActive) user.isActive = true;
    const payload = {
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      mfaEnabled: user.mfaEnabled,
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

  async singup(userObj: Partial<UserDocument>) {
    await this.userService.createUser(userObj);
  }

  async sendVerificationCode(user: UserDocument): Promise<void> {
    const randomNum = parseInt(
      faker.random.numeric(parseInt(process.env.VERIFICATION_CODE_LENGTH), {
        allowLeadingZeros: false,
      }),
    );
    if (!user.mfaEnabled) {
      throw new ForbiddenException(
        'User has not enabled multi-factorauthentication',
      );
    }
    user.verificationCode = randomNum;
    await user.save();
    this.mailerService.sendMail({
      from: process.env.EMAIL_SENDER,
      to: user.email,
      subject: 'Verification code',
      html: `<p><strong>Dear ${user.firstname}!</strong><br></br>Your verification code is <strong>${randomNum}</strong>
      <br></br><i>Team Guardian.</i></p>`,
    });
  }

  async verifyLogin(code: number): Promise<{ accessToken: string }> {
    const foundUser = await this.userService.findUserByCode(code);
    if (foundUser) {
      foundUser.verificationCode = 0;
      await foundUser.save();
      return this.login(foundUser);
    } else {
      throw new UnauthorizedException(
        'The verification code you provided is wrong!',
      );
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
}
