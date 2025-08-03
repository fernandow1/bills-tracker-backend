/* eslint-disable @typescript-eslint/naming-convention */
import { Router } from 'express';
import { CurrencyController } from '@presentation/currency/controller';
import { CurrencyDataSourceImpl } from '@infrastructure/datasource/currency/currency.datasource.impl';
import { CurrencyRepositoryImpl } from '@infrastructure/repositories/currency/currency.repository.impl';

export const CurrencyRouter = {
  routes(): Router {
    const router = Router();

    const currencyDataSource = new CurrencyDataSourceImpl();
    const currencyRepository = new CurrencyRepositoryImpl(currencyDataSource);
    const controller = new CurrencyController(currencyRepository);

    router.get('/', (req, res) => {
      controller.getCurrencies(req, res);
    });
    router.post('/', (req, res) => {
      controller.createCurrency(req, res);
    });
    router.put('/:id', (req, res) => {
      controller.updateCurrency(req, res);
    });
    router.delete('/:id', (req, res) => {
      controller.deleteCurrency(req, res);
    });

    return router;
  },
};
