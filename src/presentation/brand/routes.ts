/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response, Router } from 'express';
import { DataSource } from 'typeorm';
import { BrandDataSourceImpl } from '@infrastructure/datasource/brand/brand.datasource.impl';
import { BrandRepositoryImpl } from '@infrastructure/repositories/brand/brand.repository.impl';
import { BrandController } from '@presentation/brand/controller';
import { validateJwt } from '@infrastructure/http/middlewares/validate-jwt.middleware';
import { checkAbility } from '@infrastructure/http/middlewares/check-ability.middleware';

export const BrandRouter = {
  routes(dataSource: DataSource): Router {
    const router = Router();

    const brandDataSource = new BrandDataSourceImpl(dataSource);
    const brandRepository = new BrandRepositoryImpl(brandDataSource);
    const brandController = new BrandController(brandRepository);

    router.get(
      '/',
      [validateJwt, checkAbility('read', 'Brand')],
      (req: Request, res: Response, next: NextFunction) => {
        brandController.getBrands(req, res, next);
      },
    );
    router.get(
      '/search',
      [validateJwt, checkAbility('read', 'Brand')],
      (req: Request, res: Response, next: NextFunction) => {
        brandController.searchBrands(req, res, next);
      },
    );
    router.post(
      '/',
      [validateJwt, checkAbility('create', 'Brand')],
      (req: Request, res: Response, next: NextFunction) => {
        brandController.createBrand(req, res, next);
      },
    );
    router.put(
      '/:id',
      [validateJwt, checkAbility('update', 'Brand')],
      (req: Request, res: Response, next: NextFunction) => {
        brandController.updateBrand(req, res, next);
      },
    );
    router.delete(
      '/:id',
      [validateJwt, checkAbility('delete', 'Brand')],
      (req: Request, res: Response, next: NextFunction) => {
        brandController.deleteBrand(req, res, next);
      },
    );

    return router;
  },
};
