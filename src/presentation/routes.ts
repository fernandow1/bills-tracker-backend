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
import { AppDataSource } from '@infrastructure/database/connection';
import { TestDataSource } from '@infrastructure/database/connection-test';

export const AppRoutes = {
  routes(): Router {
    const router = Router();

    const dataSource = process.env.NODE_ENV === 'test' ? TestDataSource : AppDataSource;

    // Define your routes here
    router.use('/api/shops', ShopRouter.routes(dataSource));
    router.use('/api/currencies', CurrencyRouter.routes(dataSource));
    router.use('/api/users', UserRouter.routes(dataSource));
    router.use('/api/payment-methods', PaymentMethodRouter.routes(dataSource));
    router.use('/api/brands', BrandRouter.routes(dataSource));
    router.use('/api/categories', CategoryRouter.routes(dataSource));
    router.use('/api/products', ProductRouter.routes(dataSource));
    router.use('/api/bills', BillRouter.routes(dataSource));

    return router;
  },
};
