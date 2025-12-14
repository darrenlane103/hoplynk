import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { RequestWithId } from './request-id.middleware';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: RequestWithId, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = Date.now();
    const requestId = req.id || 'unknown';

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      const message = `${method} ${originalUrl} ${statusCode} - ${duration}ms [${requestId}]`;

      if (statusCode >= 500) {
        this.logger.error(message);
      } else if (statusCode >= 400) {
        this.logger.warn(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }
}
