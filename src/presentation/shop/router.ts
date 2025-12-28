/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Router, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { ShopDataSourceImpl } from '@infrastructure/datasource/shop/shop.datasource.impl';
import { ShopRepositoryImpl } from '@infrastructure/repositories/shop/shop.repository.impl';
import { ShopController } from '@presentation/shop/controller';

export const ShopRouter = {
  routes(dataSource: DataSource): Router {
    const router = Router();

    const shopDataSource = new ShopDataSourceImpl(dataSource);

    const shopRepository = new ShopRepositoryImpl(shopDataSource);

    const shopController = new ShopController(shopRepository);

    router.get('/search', (req: Request, res: Response, next: NextFunction) => {
      shopController.searchShops(req, res, next);
    });

    router.get('/', (req: Request, res: Response, next: NextFunction) => {
      shopController.getShops(req, res, next);
    });

    router.post('/', (req: Request, res: Response, next: NextFunction) => {
      shopController.createShop(req, res, next);
    });

    router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
      shopController.updateShop(req, res, next);
    });

    return router;
  },
};
