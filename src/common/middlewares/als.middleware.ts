import { Injectable, NestMiddleware } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AlsMiddleware implements NestMiddleware {
  constructor(private readonly als: AsyncLocalStorage<any>) {}
  use(req: Request, res: Response, next: NextFunction) {
    const store = new Map<string, any>();
    this.als.run(store, () => next());
  }
}
