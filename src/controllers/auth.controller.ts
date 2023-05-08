import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { LocalAuthGaurd } from 'src/config/auth-local.gaurd';
import { AuthService } from 'src/services/auth.service';
import { CustomReq } from 'src/types/custom';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGaurd)
  @Post('/login')
  @HttpCode(200)
  async login(@Req() req: CustomReq) {
    if (!req.user.mfa.enabled) {
      return this.authService.login(req.user);
    } else {
      return 'Waiting for the verification code ...';
    }
  }

  @Post('/signup')
  @HttpCode(201)
  async signup(@Body() userData) {
    await this.authService.singup(userData);
  }

  @Post('/verify-code')
  async verifyCode(@Body() body: { token: string; email: string }) {
    if (!body.token) {
      throw new UnauthorizedException('Verification code can not be 0');
    }
    if (!body.email) {
      throw new UnauthorizedException('User email is madatory');
    }
    return await this.authService.verifyLogin(body.email, body.token);
  }

  @Patch('/forgot-password')
  async resetPassword(@Body() body: { email: string }) {
    await this.authService.sendTemporaryPassword(body.email);
  }
}
