import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthTokenGaurd } from 'src/config/auth-token.gaurd';
import { UserService } from 'src/services/user.service';
import { CustomReq } from 'src/types/custom';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthTokenGaurd)
  @Patch('deactivate')
  async deactivateAccount(
    @Req() req: CustomReq,
    @Body('password') password: string,
  ) {
    await this.userService.deactivate(req.user);
  }

  @UseGuards(AuthTokenGaurd)
  @Patch('disable-mfa')
  async disableMfa(@Req() req: CustomReq) {
    await this.userService.disableMfa(req.user);
  }

  @UseGuards(AuthTokenGaurd)
  @Patch('enable-mfa')
  async enableMfa(@Req() req: CustomReq, @Body('token') token: string) {
    const updated = await this.userService.enableMfa(req.user, token);
    return {
      email: updated.email,
      firstname: updated.firstname,
      lastname: updated.lastname,
      mfaEnabled: true,
    };
  }

  @Get('confirm')
  async confirmEmail(@Query('id') id) {
    return await this.userService.confirmEmail(id);
  }

  @UseGuards(AuthTokenGaurd)
  @Put('change-name')
  async changeName(
    @Req() req: CustomReq,
    @Body() body: { firstname: string; lastname: string },
  ) {
    await this.userService.changeName(req.user, body);
  }

  @UseGuards(AuthTokenGaurd)
  @Patch('change-password')
  async changePassword(
    @Req() req: CustomReq,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    if (await bcrypt.compare(body.newPassword, req.user.password)) {
      throw new BadRequestException(
        'New password can not the same as old password',
      );
    }
    if (!(await bcrypt.compare(body.currentPassword, req.user.password))) {
      throw new BadRequestException('Current password is incorrect!');
    }
    await this.userService.changePassword(req.user, body);
  }

  @UseGuards(AuthTokenGaurd)
  @Get('mfa-otpauthurl')
  @HttpCode(200)
  async getOtpAuthUrl(@Req() req: CustomReq) {
    return await this.userService.getQrCodeUrl(req.user);
  }

  @UseGuards(AuthTokenGaurd)
  @Get('profile')
  async getProfile(@Req() req: CustomReq) {
    return {
      email: req.user.email,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      mfaEnabled: req.user.mfa.enabled,
    };
  }
}
