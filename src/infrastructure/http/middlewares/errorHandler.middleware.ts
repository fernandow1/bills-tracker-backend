import { AppError } from '@application/errors/app-error';
import { NextFunction, Request, Response } from 'express';

interface PayloadError {
  error: {
    msg: string;
    code: string;
    details?: string;
    stack?: string;
    cause?: string;
  };
}

const ISPROD = process.env.NODE_ENV === 'production';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  let appError: AppError;

  if (err instanceof AppError) {
    appError = err;
  } else {
    appError = new AppError('Unexpected error', 'INTERNAL_ERROR', 500, ISPROD ? undefined : err);
  }

  console.error({
    msg: appError.message,
    code: appError.code,
    status: appError.statusCode,
    path: req.path,
    method: req.method,
    // solo en no-prod:
    stack: ISPROD ? undefined : (appError as AppError).stack,
    cause: ISPROD ? undefined : (appError as AppError).cause,
  });

  const payload: PayloadError = {
    error: {
      msg: appError.message,
      code: appError.code,
      details: appError.details ? JSON.stringify(appError.details) : undefined,
    },
  };

  res.status(appError.statusCode).json(payload);
}
