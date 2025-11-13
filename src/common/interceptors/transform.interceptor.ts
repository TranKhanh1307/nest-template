import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { Reflector } from '@nestjs/core';
import { SKIP_TRANSFORM } from '../decorators/skip-transform.decorator';

export interface CustomResponse<T> {
  data: T;
  code: HttpStatus;
  message: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, CustomResponse<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Observable<CustomResponse<T>> {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_TRANSFORM, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (skip) return next.handle();

    const response = ctx.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data: T) => ({
        data: data,
        code: response.statusCode,
        message: 'Successful',
      })),
    );
  }
}
