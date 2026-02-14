import {
  createHttpError,
  HttpError,
  isHttpError as isHttpErrorFn,
} from '@application/errors/http-error.interface';

export function badRequest(message: string, details?: unknown): HttpError {
  return createHttpError(message, 400, details);
}

export function unauthorized(message: string, details?: unknown): HttpError {
  return createHttpError(message, 401, details);
}

export function forbidden(message: string, details?: unknown): HttpError {
  return createHttpError(message, 403, details);
}

export function notFound(message: string, details?: unknown): HttpError {
  return createHttpError(message, 404, details);
}

export function conflict(message: string, details?: unknown): HttpError {
  return createHttpError(message, 409, details);
}

export function rateLimited(message: string, details?: unknown): HttpError {
  return createHttpError(message, 429, details);
}

export function internalError(message: string, details?: unknown): HttpError {
  return createHttpError(message, 500, details);
}

// Re-export isHttpError for convenience
export const isHttpError = isHttpErrorFn;
