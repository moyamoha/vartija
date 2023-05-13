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

  @Sse('notifications')
  sse(): Observable<MessageEvent> {
    return interval(1000).pipe(map((_) => ({ data: { hello: 'world' } })));
  }
}
