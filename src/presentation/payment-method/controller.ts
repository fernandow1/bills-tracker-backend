import { plainToClass } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import { CreatePaymentMethodDTO } from '@application/dtos/payment-method/create-payment-method.dto';
import { PaymentMethodRepository } from '@domain/repository/payment-method.repository';
import { validate } from 'class-validator';
import { badRequest, internalError, notFound } from '@presentation/helpers/http-error.helper';
import { CreatePaymentMethod } from '@application/uses-cases/payment-method/create-payment-method';
import { GetPaymentsMethod } from '@application/uses-cases/payment-method/get-payment-methods';
import { DeletePaymentMethod } from '@application/uses-cases/payment-method/delete-payment-method';
import { UpdatePaymentMethod } from '@application/uses-cases/payment-method/update-payment-method';
import { EntityNotFoundError } from 'typeorm';
import { isHttpError } from '@application/errors/http-error.interface';

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
        return next(badRequest('Validation failed', validationErrors));
      }
      const paymentMethod = await new CreatePaymentMethod(this.repository).execute(dto);

      res.status(201).json(paymentMethod);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(internalError('Internal server error'));
    }
  };

  deletePaymentMethod = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uuid = req.params.uuid;
      await new DeletePaymentMethod(this.repository).execute(uuid);
      res.status(204).send();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return next(notFound(`Payment method with uuid ${req.params.uuid} not found`));
      }

      if (isHttpError(error)) {
        return next(error);
      }

      return next(internalError('Internal server error'));
    }
  };

  updatePaymentMethod = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uuid = req.params.uuid;
      const dto = plainToClass(CreatePaymentMethodDTO, req.body);

      const validationErrors = await validate(dto, {
        whitelist: true,
        validationError: { target: false, value: false },
      });

      if (validationErrors.length) {
        return next(badRequest('Validation failed', validationErrors));
      }

      const updatedPaymentMethod = await new UpdatePaymentMethod(this.repository).execute(
        uuid,
        dto,
      );

      res.status(200).json(updatedPaymentMethod);
    } catch (error: unknown) {
      // Manejar EntityNotFoundError de TypeORM
      if (error instanceof EntityNotFoundError) {
        return next(notFound(`Payment method with uuid ${req.params.uuid} not found`));
      }

      if (isHttpError(error)) {
        return next(error);
      }

      return next(internalError('Internal server error'));
    }
  };

  getAllPaymentMethods = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const paymentMethods = await new GetPaymentsMethod(this.repository).execute();
      res.status(200).json(paymentMethods);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(internalError('Internal server error'));
    }
  };
}
