import { plainToClass } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import { CreatePaymentMethodDTO } from '@application/dtos/payment-method/create-payment-method.dto';
import { PaymentMethodRepository } from '@domain/repository/payment-method.repository';
import { validate } from 'class-validator';
import { AppError } from '@application/errors/app-error';
import { CreatePaymentMethod } from '@application/uses-cases/payment-method/create-payment-method';
import { GetPaymentsMethod } from '@application/uses-cases/payment-method/get-payment-methods';

export class PaymentMethodController {
  constructor(private readonly repository: PaymentMethodRepository) {}

  createPaymentMethod = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToClass(CreatePaymentMethodDTO, req.body);
      const validationErrors = await validate(dto, {
        whitelist: true,
        validationError: { target: false, value: false },
      });

      if (validationErrors.length) {
        return next(AppError.badRequest('Validation failed', validationErrors));
      }
      const paymentMethod = await new CreatePaymentMethod(this.repository).execute(dto);

      res.status(201).json(paymentMethod);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(AppError.internalError('Internal server error'));
    }
  };

  getAllPaymentMethods = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const paymentMethods = await new GetPaymentsMethod(this.repository).execute();
      res.status(200).json(paymentMethods);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(AppError.internalError('Internal server error'));
    }
  };
}
