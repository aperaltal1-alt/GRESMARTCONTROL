import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(LoggingInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{
      method: string;
      url: string;
      id?: string;
    }>();
    const { method, url, id } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.info(
            { method, url, requestId: id, duration: `${Date.now() - now}ms` },
            'Request completed',
          );
        },
        error: (error: Error) => {
          this.logger.error(
            { method, url, requestId: id, duration: `${Date.now() - now}ms`, err: error },
            'Request failed',
          );
        },
      }),
    );
  }
}
