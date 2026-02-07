/* eslint-disable @typescript-eslint/naming-convention */
import { PaymentMethodDataSourceImpl } from '@infrastructure/datasource/payment-method/payment-method.datasource.impl';
import { PaymentMethodRepositoryImpl } from '@infrastructure/repositories/payment-method/payment-method.repository.impl';
import { NextFunction, Request, Response, Router } from 'express';
import { DataSource } from 'typeorm';
import { PaymentMethodController } from './controller';
import { validateJwt } from '@infrastructure/http/middlewares/validate-jwt.middleware';
import { checkAbility } from '@infrastructure/http/middlewares/check-ability.middleware';

export const PaymentMethodRouter = {
  routes(dataSource: DataSource): Router {
    const router = Router();

    const paymentMethodDataSource = new PaymentMethodDataSourceImpl(dataSource);
    const paymentMethodRepository = new PaymentMethodRepositoryImpl(paymentMethodDataSource);
    const paymentMethodController = new PaymentMethodController(paymentMethodRepository);

    router.get(
      '/',
      [validateJwt, checkAbility('read', 'PaymentMethod')],
      (req: Request, res: Response, next: NextFunction) => {
        paymentMethodController.getAllPaymentMethods(req, res, next);
      },
    );
    router.post(
      '/',
      [validateJwt, checkAbility('create', 'PaymentMethod')],
      (req: Request, res: Response, next: NextFunction) => {
        paymentMethodController.createPaymentMethod(req, res, next);
      },
    );
    router.put(
      '/:id',
      [validateJwt, checkAbility('update', 'PaymentMethod')],
      (req: Request, res: Response, next: NextFunction) => {
        paymentMethodController.updatePaymentMethod(req, res, next);
      },
    );
    router.delete(
      '/:id',
      [validateJwt, checkAbility('delete', 'PaymentMethod')],
      (req: Request, res: Response, next: NextFunction) => {
        paymentMethodController.deletePaymentMethod(req, res, next);
      },
    );

    return router;
  },
};
