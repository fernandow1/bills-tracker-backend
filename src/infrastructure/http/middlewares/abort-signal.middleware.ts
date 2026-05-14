import { Request, Response, NextFunction } from 'express';

export const withAbortSignal = (req: Request, res: Response, next: NextFunction) => {
  const abortController = new AbortController();

  req.on('close', () => {
    if (!res.writableEnded) {
      abortController.abort();
    }
  });

  // Inject the signal into the request object
  (req as any).abortSignal = abortController.signal;

  next();
};
