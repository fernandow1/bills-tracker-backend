import { ProductDataSourceImpl } from '@infrastructure/datasource/product/product.datasource.impl';
import { ProductRepositoryImpl } from '@infrastructure/repositories/product/product.repository.impl';
import { BillItemDatasourceImpl } from '@infrastructure/datasource/bill-item/bill-item.datasource.impl';
import { BillItemRepositoryImpl } from '@infrastructure/repositories/bill-item/bill-item.repository.impl';
import { NextFunction, Request, Response, Router } from 'express';
import { DataSource } from 'typeorm';
import { ProductController } from '@presentation/product/controller';
import { validateJwt } from '@infrastructure/http/middlewares/validate-jwt.middleware';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ProductRouter = {
  routes(dataSource: DataSource): Router {
    const router = Router();

    const productDataSource = new ProductDataSourceImpl(dataSource);
    const productRepository = new ProductRepositoryImpl(productDataSource);

    const billItemDataSource = new BillItemDatasourceImpl(dataSource);
    const billItemRepository = new BillItemRepositoryImpl(billItemDataSource);

    const controller = new ProductController(productRepository, billItemRepository);

    router.get('/', [validateJwt], (req: Request, res: Response, next: NextFunction) => {
      controller.getProducts(req, res, next);
    });
    router.get('/search', [validateJwt], (req: Request, res: Response, next: NextFunction) => {
      controller.searchProducts(req, res, next);
    });
    router.get('/:id/cheapest-shops', [validateJwt], (req: Request, res: Response, next: NextFunction) => {
      controller.getCheapestShops(req, res, next);
    });
    router.get('/:id', [validateJwt], (req: Request, res: Response, next: NextFunction) => {
      controller.getProduct(req, res, next);
    });
    router.post('/', [validateJwt], (req: Request, res: Response, next: NextFunction) => {
      controller.createProduct(req, res, next);
    });
    router.put('/:id', [validateJwt], (req: Request, res: Response, next: NextFunction) => {
      controller.updateProduct(req, res, next);
    });
    router.delete('/:id', [validateJwt], (req: Request, res: Response, next: NextFunction) => {
      controller.deleteProduct(req, res, next);
    });

    return router;
  },
};
