import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { LocalAuthGaurd } from 'src/config/auth-local.gaurd';
import { AuthService } from 'src/services/auth.service';
import { CustomReq } from 'src/types/custom';
import {
  CreateUserDto,
  ResetPasswordPayload,
  VerifyCodePayloaed,
} from 'src/utils/dtos/user';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGaurd)
  @Post('/login')
  async login(@Req() req: CustomReq, @Res() res) {
    if (!req.user.mfa.enabled) {
      const loginResponseObj = await this.authService.login(req.user);
      return res.status(200).json(loginResponseObj);
    } else {
      this.authService.generateOtp(req.user);
      return res.status(202).send('Verification code Required');
    }
  }

  @Post('/signup')
  @HttpCode(201)
  async signup(@Body() userData: CreateUserDto) {
    await this.authService.singup(userData);
  }

  @Post('/verify-totp')
  async verifyCode(@Body() body: VerifyCodePayloaed) {
    if (!body.token) {
      throw new UnauthorizedException('Token cannot be empty');
    }
    if (!body.email) {
      throw new UnauthorizedException('User email is madatory');
    }
    return await this.authService.verifyLogin(body.email, body.token);
  }

  @Patch('/forgot-password')
  async resetPassword(@Body() body: ResetPasswordPayload) {
    await this.authService.sendTemporaryPassword(body.email);
  }
}
