import {
  Controller,
  Get,
  Req,
  UseGuards,
  MessageEvent,
  Sse,
} from '@nestjs/common';
import { AppService } from '../services/app.service';
import { AuthTokenGaurd } from 'src/config/auth-token.gaurd';
import { CustomReq } from 'src/types/custom';
import { Observable, interval, map } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthTokenGaurd)
  @Sse('notifications')
  sse(@Req() req: CustomReq): Observable<MessageEvent> {
    return interval(1000).pipe(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      map((_) => ({
        data: {
          isActive: req.user.isActive,
          profile: {
            firstName: req.user.firstname,
            lastName: req.user.lastname,
            email: req.user.email,
            mfaEnabled: req.user.mfa.enabled,
          },
        },
      })),
    );
  }
}
