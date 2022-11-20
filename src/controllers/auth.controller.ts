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
    if (!req.user.mfaEnabled) {
      return this.authService.login(req.user);
    } else {
      return this.authService.sendVerificationCode(req.user);
    }
  }

  @Post('/signup')
  @HttpCode(201)
  async signup(@Body() userData) {
    await this.authService.singup(userData);
  }

  @Post('/verify-code')
  async verifyCode(@Body() body: { code: number }) {
    if (body.code === 0) {
      throw new UnauthorizedException('Verification code can not be 0');
    }
    return await this.authService.verifyLogin(body.code);
  }

  @Patch('/forgot-password')
  async resetPassword(@Body() body: { email: string }) {
    await this.authService.sendTemporaryPassword(body.email);
  }
}
