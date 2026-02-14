export interface HttpError extends Error {
  statusCode: number;
  details?: unknown;
}

export function createHttpError(message: string, statusCode: number, details?: unknown): HttpError {
  const error = new Error(message) as HttpError;
  error.statusCode = statusCode;
  error.details = details;
  return error;
}

// Type guard
export function isHttpError(error: unknown): error is HttpError {
  return error instanceof Error && 'statusCode' in error;
}
