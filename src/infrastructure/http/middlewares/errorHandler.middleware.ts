import { isHttpError } from '@application/errors/http-error.interface';
import { logger } from '@infrastructure/logging/logger.config';
import { NextFunction, Request, Response } from 'express';
import { EntityNotFoundError } from 'typeorm';

const isDevelopment = process.env.NODE_ENV !== 'production';

interface ErrorResponse {
  status: number;
  title: string;
  detail: string;
  errors?: Array<{ field: string; message: string }>;
  path?: string;
  timestamp?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  let statusCode = 500;
  let title = 'Internal Server Error';
  let detail = 'An unexpected error occurred';
  let validationErrors: Array<{ field: string; message: string }> | undefined;

  // Detectar tipo de error
  if (isHttpError(err)) {
    statusCode = err.statusCode;
    detail = err.message;
    title = getErrorTitle(statusCode);

    // Formatear errores de validación
    if (Array.isArray(err.details) && statusCode === 400) {
      validationErrors = formatValidationErrors(err.details);
      title = 'Validation Error';
      detail = 'The request contains invalid data';
    }
  } else if (err instanceof EntityNotFoundError) {
    statusCode = 404;
    title = 'Resource Not Found';
    detail = 'The requested resource does not exist';
  } else if (err instanceof Error) {
    // Error genérico - ocultar detalles en producción
    detail = isDevelopment ? err.message : 'An unexpected error occurred. Please try again later.';
  }

  // 1. LOGGING COMPLETO (Winston) - Para monitoreo/debugging
  logger.error(detail, {
    statusCode,
    title,
    path: req.path,
    method: req.method,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userId: (req as any).user?.id,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    errorType: err instanceof Error ? err.constructor.name : typeof err,
    validationErrors,
    stack: err instanceof Error ? err.stack : undefined,
    timestamp: new Date().toISOString(),
  });

  // 2. RESPUESTA LIMPIA AL FRONTEND
  const response: ErrorResponse = {
    status: statusCode,
    title,
    detail,
  };

  // Añadir errores de validación si existen
  if (validationErrors && validationErrors.length > 0) {
    response.errors = validationErrors;
  }

  // Solo en desarrollo: info adicional
  if (isDevelopment) {
    response.path = req.path;
    response.timestamp = new Date().toISOString();
  }

  res.status(statusCode).json(response);
}

// Helper: Mapear status code a título
function getErrorTitle(statusCode: number): string {
  const titles: Record<number, string> = {
    400: 'Bad Request',
    401: 'Authentication Required',
    403: 'Access Forbidden',
    404: 'Resource Not Found',
    409: 'Conflict',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
  };
  return titles[statusCode] || 'Error';
}

// Helper: Formatear errores de class-validator
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatValidationErrors(errors: any[]): Array<{ field: string; message: string }> {
  return errors.map((err) => ({
    field: err.property || 'unknown',
    message: Object.values(err.constraints || {}).join(', ') as string,
  }));
}
