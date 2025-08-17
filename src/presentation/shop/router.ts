/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Router, Response, NextFunction } from 'express';
import { ShopDataSourceImpl } from '@infrastructure/datasource/shop.datasource.impl';
import { ShopRepositoryImpl } from '@infrastructure/repositories/shop.repository.impl';
import { ShopController } from '@presentation/shop/controller';

export const ShopRouter = {
  routes(): Router {
    const router = Router();

    const shopDataSource = new ShopDataSourceImpl();

    const shopRepository = new ShopRepositoryImpl(shopDataSource);

    const shopController = new ShopController(shopRepository);

    // Define your routes here
    router.get('/', (req: Request, res: Response, next: NextFunction) => {
      shopController.getShops(req, res, next);
    });

    router.post('/', (req: Request, res: Response, next: NextFunction) => {
      shopController.createShop(req, res, next);
    });

    return router;
  },
};
