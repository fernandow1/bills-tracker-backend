type ErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'FORBIDDEN'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR';

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;
  public readonly cause?: unknown;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number,
    details?: unknown,
    cause?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code || 'INTERNAL_ERROR';
    this.statusCode = statusCode || 500;
    this.details = details;
    this.cause = cause;

    Error.captureStackTrace(this, AppError);
  }

  public static badRequest(message: string, details: unknown): AppError {
    return new AppError(message, 'VALIDATION_ERROR', 400, details);
  }

  public static notFound(message: string, details?: unknown): AppError {
    return new AppError(message, 'NOT_FOUND', 404, details);
  }

  public static forbidden(message: string, details?: unknown): AppError {
    return new AppError(message, 'FORBIDDEN', 403, details);
  }

  public static conflict(message: string, details?: unknown): AppError {
    return new AppError(message, 'CONFLICT', 409, details);
  }

  public static rateLimited(message: string, details?: unknown): AppError {
    return new AppError(message, 'RATE_LIMITED', 429, details);
  }

  public static internalError(message: string, details?: unknown): AppError {
    return new AppError(message, 'INTERNAL_ERROR', 500, details);
  }
}
