import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces';
import { buildSuccessResponse } from '../utils';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'success' in data && 'timestamp' in data) {
          return data as unknown as ApiResponse<T>;
        }

        const message =
          data && typeof data === 'object' && 'message' in data
            ? (data as { message: string }).message
            : 'Operación exitosa';

        const payload =
          data && typeof data === 'object' && 'message' in data && 'data' in data
            ? (data as { data: T }).data
            : data;

        return buildSuccessResponse(payload as T, message);
      }),
    );
  }
}
