import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, Request, NextFunction } from 'express';

@Injectable()
export class QueryParameterMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.query) {
      const query = {};
      for (const key in req.query) {
        const normalizedKey = key.replace(key[0], key[0].toUpperCase());
        query[normalizedKey] = req.query[key];
      }
      req.query = query;
    }
    next();
  }
}
