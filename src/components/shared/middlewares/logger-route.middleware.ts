import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Response, Request, NextFunction } from 'express';

@Injectable()
export class LoggerRouteMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    Logger.log({ url: req.baseUrl, ip }, 'route');
    next();
  }
}
