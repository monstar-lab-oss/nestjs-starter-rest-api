import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { REQUEST_ID_TOKEN_HEADER } from '../constant';
import { AppLogger } from '../logger/logger.service';
import { ConfigService } from '@nestjs/config';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  /** set logger context */
  constructor(private logger: AppLogger, private config: ConfigService) {
    this.logger.setContext(AllExceptionsFilter.name);
  }

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const timestamp = new Date().toISOString();
    const req: Request = ctx.getRequest<Request>();
    const res: Response = ctx.getResponse<Response>();
    const requestId = req.headers[REQUEST_ID_TOKEN_HEADER];

    let stack: any;
    let status: HttpStatus;
    let message: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse().toString();
    } else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;
    }

    status = status || HttpStatus.INTERNAL_SERVER_ERROR;
    message = message || 'Internal server error';

    const error = {
      requestId,
      status,
      message,
      timestamp,
    };
    this.logger.warn({ error, stack });

    // Suppress original internal server error details in prod mode
    const isProMood = this.config.get<string>('env') !== 'development';
    if (isProMood && status === HttpStatus.INTERNAL_SERVER_ERROR) {
      error.message = 'Internal server error';
    }
    res.status(status).json({ error });
  }
}
