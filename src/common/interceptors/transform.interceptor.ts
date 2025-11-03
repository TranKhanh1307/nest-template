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

export interface CustomResponse<T> {
  data: T;
  code: HttpStatus;
  message: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, CustomResponse<T>>
{
  intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Observable<CustomResponse<T>> {
    const response = ctx.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data: T) => ({
        data,
        code: response.statusCode,
        message: 'Successful',
      })),
    );
  }
}
