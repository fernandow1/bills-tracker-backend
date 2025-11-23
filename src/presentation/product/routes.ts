import { ProductDataSourceImpl } from '@infrastructure/datasource/product/product.datasource.impl';
import { ProductRepositoryImpl } from '@infrastructure/repositories/product/product.repository.impl';
import { NextFunction, Request, Response, Router } from 'express';
import { ProductController } from '@presentation/product/controller';
import { TestDataSource } from '@infrastructure/database/connection-test';
import { AppDataSource } from '@infrastructure/database/connection';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ProductRouter = {
  routes(): Router {
    const router = Router();

    const dataSource = process.env.NODE_ENV === 'test' ? TestDataSource : AppDataSource;

    const productDataSource = new ProductDataSourceImpl(dataSource);

    const productRepository = new ProductRepositoryImpl(productDataSource);

    const controller = new ProductController(productRepository);

    router.get('/', (req: Request, res: Response, next: NextFunction) => {
      controller.getProducts(req, res, next);
    });
    router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
      controller.getProduct(req, res, next);
    });
    router.post('/', (req: Request, res: Response, next: NextFunction) => {
      controller.createProduct(req, res, next);
    });
    router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
      controller.updateProduct(req, res, next);
    });
    router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
      controller.deleteProduct(req, res, next);
    });

    return router;
  },
};
