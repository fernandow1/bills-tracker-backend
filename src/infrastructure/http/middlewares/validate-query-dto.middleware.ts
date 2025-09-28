import { AppError } from '@application/errors/app-error';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import type { QueryFilterDTO } from '@infrastructure/http/dto/query-filter.dto';

export function validateQueryFilter<T extends object>(
  cls: ClassConstructor<T>,
  source: 'query' | 'body' = 'query',
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const payload = source === 'query' ? req.query : req.body;

    const instance = plainToInstance(cls, payload, {
      enableImplicitConversion: false,
      excludeExtraneousValues: true,
    });

    const errors = await validate(instance, {
      whitelist: true,
      validationError: { target: false, value: false },
    });

    if (errors.length) {
      return next(AppError.badRequest('Validation failed', errors));
    }

    req.queryFilter = instance as unknown as QueryFilterDTO;

    next();
  };
}
