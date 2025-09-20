/* eslint-disable @typescript-eslint/naming-convention */
import { Router } from 'express';
import { ShopRouter } from '@presentation/shop/router';
import { CurrencyRouter } from '@presentation/currency/router';
import { UserRouter } from '@presentation/user/router';
import { PaymentMethodRouter } from '@presentation/payment-method/routes';
import { BrandRouter } from '@presentation/brand/routes';
import { CategoryRouter } from '@presentation/category/router';
import { ProductRouter } from '@presentation/product/routes';
import { BillRouter } from '@presentation/bill/routes';

export const AppRoutes = {
  routes(): Router {
    const router = Router();

    // Define your routes here
    router.use('/api/shops', ShopRouter.routes());
    router.use('/api/currencies', CurrencyRouter.routes());
    router.use('/api/users', UserRouter.routes());
    router.use('/api/payment-methods', PaymentMethodRouter.routes());
    router.use('/api/brands', BrandRouter.routes());
    router.use('/api/categories', CategoryRouter.routes());
    router.use('/api/products', ProductRouter.routes());
    router.use('/api/bills', BillRouter.routes());

    return router;
  },
};
