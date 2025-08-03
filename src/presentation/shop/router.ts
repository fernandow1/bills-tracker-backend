/* eslint-disable @typescript-eslint/naming-convention */
import { Router } from 'express';
import { ShopDataSourceImpl } from '@infrastructure/datasource/shop.datasource.impl';
import { ShopRepositoryImpl } from '@infrastructure/repositories/actor.repository.impl';
import { ShopController } from '@presentation/shop/controller';

export const ShopRouter = {
  routes(): Router {
    const router = Router();

    const shopDataSource = new ShopDataSourceImpl();

    const shopRepository = new ShopRepositoryImpl(shopDataSource);

    const shopController = new ShopController(shopRepository);

    // Define your routes here
    router.get('/', (req, res) => {
      shopController.getShops(req, res);
    });

    router.post('/', (req, res) => {
      shopController.createShop(req, res);
    });

    return router;
  },
};
