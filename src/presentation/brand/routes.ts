/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response, Router } from 'express';
import { BrandDataSourceImpl } from '@infrastructure/datasource/brand/brand.datasource.impl';
import { BrandRepositoryImpl } from '@infrastructure/repositories/brand/brand.repository.impl';
import { BrandController } from '@presentation/brand/controller';
import { AppDataSource } from '@infrastructure/database/connection';
import { TestDataSource } from '@infrastructure/database/connection-test';

export const BrandRouter = {
  routes(): Router {
    const router = Router();

    const dataSource = process.env.NODE_ENV === 'test' ? TestDataSource : AppDataSource;
    const brandDataSource = new BrandDataSourceImpl(dataSource);
    const brandRepository = new BrandRepositoryImpl(brandDataSource);
    const brandController = new BrandController(brandRepository);

    router.post('/', (req: Request, res: Response, next: NextFunction) => {
      brandController.createBrand(req, res, next);
    });
    router.get('/', (req: Request, res: Response, next: NextFunction) => {
      brandController.getBrands(req, res, next);
    });
    router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
      brandController.updateBrand(req, res, next);
    });
    router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
      brandController.deleteBrand(req, res, next);
    });

    return router;
  },
};
