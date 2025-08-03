/* eslint-disable @typescript-eslint/naming-convention */
import { Router } from 'express';
import { ShopRouter } from '@presentation/shop/router';

export const AppRoutes = {
  routes(): Router {
    const router = Router();

    // Define your routes here
    router.use('/api/shops', ShopRouter.routes());

    return router;
  },
};
