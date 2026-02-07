/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Router, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { CurrencyController } from '@presentation/currency/controller';
import { CurrencyDataSourceImpl } from '@infrastructure/datasource/currency/currency.datasource.impl';
import { CurrencyRepositoryImpl } from '@infrastructure/repositories/currency/currency.repository.impl';
import { validateJwt } from '@infrastructure/http/middlewares/validate-jwt.middleware';
import { checkAbility } from '@infrastructure/http/middlewares/check-ability.middleware';

export const CurrencyRouter = {
  routes(dataSource: DataSource): Router {
    const router = Router();

    const currencyDataSource = new CurrencyDataSourceImpl(dataSource);
    const currencyRepository = new CurrencyRepositoryImpl(currencyDataSource);
    const controller = new CurrencyController(currencyRepository);

    router.get(
      '/',
      [validateJwt, checkAbility('read', 'Currency')],
      (req: Request, res: Response, next: NextFunction) => {
        controller.getCurrencies(req, res, next);
      },
    );
    router.post(
      '/',
      [validateJwt, checkAbility('create', 'Currency')],
      (req: Request, res: Response, next: NextFunction) => {
        controller.createCurrency(req, res, next);
      },
    );
    router.put(
      '/:id',
      [validateJwt, checkAbility('update', 'Currency')],
      (req: Request, res: Response, next: NextFunction) => {
        controller.updateCurrency(req, res, next);
      },
    );
    router.delete(
      '/:id',
      [validateJwt, checkAbility('delete', 'Currency')],
      (req: Request, res: Response, next: NextFunction) => {
        controller.deleteCurrency(req, res, next);
      },
    );

    return router;
  },
};
