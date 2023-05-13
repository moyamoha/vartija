import { Controller, MessageEvent, Query, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, interval, map } from 'rxjs';

@Controller('notifications')
export class AppController {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Sse('profile-update')
  sse(@Query('channel') channel: string): Observable<MessageEvent> {
    return interval(1000).pipe(map((_) => ({ data: { hello: 'world' } })));
  }
}
