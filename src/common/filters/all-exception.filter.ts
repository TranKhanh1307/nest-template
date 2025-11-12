import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { format } from 'date-fns';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? (exception.getResponse()['message'] as string)
        : 'INTERNAL_SERVER_ERROR';

    const responseBody = {
      statusCode: httpStatus,
      message: message,
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    this.logger.error((exception as Error).message, {
      stack: (exception as Error).stack,
    });

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
