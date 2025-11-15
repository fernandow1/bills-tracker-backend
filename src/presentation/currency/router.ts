/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Router, Response, NextFunction } from 'express';
import { CurrencyController } from '@presentation/currency/controller';
import { CurrencyDataSourceImpl } from '@infrastructure/datasource/currency/currency.datasource.impl';
import { CurrencyRepositoryImpl } from '@infrastructure/repositories/currency/currency.repository.impl';
import { TestDataSource } from '@infrastructure/database/connection-test';
import { AppDataSource } from '@infrastructure/database/connection';

export const CurrencyRouter = {
  routes(): Router {
    const router = Router();

    const dataSource = process.env.NODE_ENV === 'test' ? TestDataSource : AppDataSource;
    const currencyDataSource = new CurrencyDataSourceImpl(dataSource);
    const currencyRepository = new CurrencyRepositoryImpl(currencyDataSource);
    const controller = new CurrencyController(currencyRepository);

    router.get('/', (req: Request, res: Response, next: NextFunction) => {
      controller.getCurrencies(req, res, next);
    });
    router.post('/', (req: Request, res: Response, next: NextFunction) => {
      controller.createCurrency(req, res, next);
    });
    router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
      controller.updateCurrency(req, res, next);
    });
    router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
      controller.deleteCurrency(req, res, next);
    });

    return router;
  },
};
