/* eslint-disable @typescript-eslint/naming-convention */
import { Router } from 'express';
import { ShopRouter } from '@presentation/shop/router';
import { CurrencyRouter } from '@presentation/currency/router';
import { UserRouter } from '@presentation/user/router';
import { PaymentMethodRouter } from '@presentation/payment-method/routes';

export const AppRoutes = {
  routes(): Router {
    const router = Router();

    // Define your routes here
    router.use('/api/shops', ShopRouter.routes());
    router.use('/api/currencies', CurrencyRouter.routes());
    router.use('/api/users', UserRouter.routes());
    router.use('/api/payment-methods', PaymentMethodRouter.routes());

    return router;
  },
};
