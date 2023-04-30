import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
  async deactivateAccount(@Req() req: CustomReq) {
    await this.userService.deactivate(req.user);
  }

  @UseGuards(AuthTokenGaurd)
  @Patch('toggle-mfa')
  async toggleMfa(@Req() req: CustomReq, @Body('mfaEnabled') mfaEnabled) {
    const updated = await this.userService.changeMfaState(
      req.user._id,
      mfaEnabled,
    );
    return {
      email: updated.email,
      firstname: updated.firstname,
      lastname: updated.lastname,
      mfaEnabled: updated.mfaEnabled,
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
  @Get('activity-history')
  async getActivityHistory(@Req() req: CustomReq) {
    return await this.userService.getActivityHistory(req.user._id);
  }

  @UseGuards(AuthTokenGaurd)
  @Delete('activity-history')
  @HttpCode(204)
  async clearActivityHistory(@Req() req: CustomReq) {
    await this.userService.clearActivityHistory(req.user._id);
  }
}
