import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponse } from '../interfaces';
import { buildErrorResponse } from '../utils';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message = 'Error interno del servidor';
    let errors: string[] | Record<string, string[]> | undefined;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (exceptionResponse && typeof exceptionResponse === 'object') {
      const resp = exceptionResponse as Record<string, unknown>;
      message = Array.isArray(resp.message)
        ? (resp.message as string[]).join(', ')
        : (resp.message as string) ?? message;

      if (Array.isArray(resp.message)) {
        errors = resp.message as string[];
      } else if (typeof resp.message === 'object') {
        errors = resp.message as Record<string, string[]>;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    if (status >= 500) {
      this.logger.error(
        { err: exception, path: request.url, method: request.method },
        message,
      );
    } else {
      this.logger.warn({ path: request.url, method: request.method, status }, message);
    }

    const body: ApiErrorResponse = {
      ...buildErrorResponse(message, errors),
      statusCode: status,
      path: request.url,
    };

    response.status(status).json(body);
  }
}
