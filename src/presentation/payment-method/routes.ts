/* eslint-disable @typescript-eslint/naming-convention */
import { PaymentMethodDataSourceImpl } from '@infrastructure/datasource/payment-method/payment-method.datasource.impl';
import { PaymentMethodRepositoryImpl } from '@infrastructure/repositories/payment-method/payment-method.repository.impl';
import { NextFunction, Request, Response, Router } from 'express';
import { PaymentMethodController } from './controller';
import { AppDataSource } from '@infrastructure/database/connection';
import { TestDataSource } from '@infrastructure/database/connection-test';

export const PaymentMethodRouter = {
  routes(): Router {
    const router = Router();

    const dataSource = process.env.NODE_ENV === 'test' ? TestDataSource : AppDataSource;
    const paymentMethodDataSource = new PaymentMethodDataSourceImpl(dataSource);
    const paymentMethodRepository = new PaymentMethodRepositoryImpl(paymentMethodDataSource);
    const paymentMethodController = new PaymentMethodController(paymentMethodRepository);

    router.get('/', (req: Request, res: Response, next: NextFunction) => {
      paymentMethodController.getAllPaymentMethods(req, res, next);
    });
    router.post('/', (req: Request, res: Response, next: NextFunction) => {
      paymentMethodController.createPaymentMethod(req, res, next);
    });
    router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
      paymentMethodController.updatePaymentMethod(req, res, next);
    });
    router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
      paymentMethodController.deletePaymentMethod(req, res, next);
    });

    return router;
  },
};
