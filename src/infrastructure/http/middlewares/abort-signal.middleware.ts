import { Request, Response, NextFunction } from 'express';
import { logger } from '@infrastructure/logging/logger.config';

export const withAbortSignal = (req: Request, res: Response, next: NextFunction) => {
  const abortController = new AbortController();

  // res.on('close') es más confiable para detectar si el cliente cortó la conexión.
  res.on('close', () => {
    if (!res.writableEnded) {
      logger.warn({
        message: 'Request closed by the client or proxy before completing. Aborting operation.',
        url: req.originalUrl,
        ip: req.ip,
      });
      abortController.abort(new Error('Request closed before completing'));
    }
  });

  // Inject the signal into the request object
  (req as any).abortSignal = abortController.signal;

  next();
};
