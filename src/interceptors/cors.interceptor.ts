import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';
import { Observable } from 'rxjs';

@Injectable()
export class CorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: IncomingMessage = context.switchToHttp().getRequest();
    const response: ServerResponse = context.switchToHttp().getResponse();

    if ('access-control-request-headers' in request.headers) {
      response.setHeader(
        'access-control-request-headers',
        request.headers['access-control-request-headers'],
      );
    }

    if ('access-control-request-method' in request.headers) {
      response.setHeader(
        'access-control-request-method',
        request.headers['access-control-request-method'],
      );
    }

    response.setHeader('access-control-allow-origin', '*');

    return next.handle();
  }
}
