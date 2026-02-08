import { CategoryDataSourceImpl } from '@infrastructure/datasource/category/category.datasource.impl';
import { CategoryRepositoryImpl } from '@infrastructure/repositories/category/category.repository.impl';
import { NextFunction, Request, Response, Router } from 'express';
import { DataSource } from 'typeorm';
import { CategoryController } from '@presentation/category/controller';
import { validateJwt } from '@infrastructure/http/middlewares/validate-jwt.middleware';
import { checkAbility } from '@infrastructure/http/middlewares/check-ability.middleware';

/* eslint-disable @typescript-eslint/naming-convention */
export const CategoryRouter = {
  routes(dataSource: DataSource): Router {
    const router = Router();

    const categoryDataSource = new CategoryDataSourceImpl(dataSource);
    const categoryRepository = new CategoryRepositoryImpl(categoryDataSource);

    const categoryController = new CategoryController(categoryRepository);

    router.get(
      '/',
      [validateJwt, checkAbility('read', 'Category')],
      (req: Request, res: Response, next: NextFunction) =>
        categoryController.getAllCategories(req, res, next),
    );
    router.get(
      '/search',
      [validateJwt, checkAbility('read', 'Category')],
      (req: Request, res: Response, next: NextFunction) =>
        categoryController.searchCategories(req, res, next),
    );
    router.post(
      '/',
      [validateJwt, checkAbility('create', 'Category')],
      (req: Request, res: Response, next: NextFunction) =>
        categoryController.createCategory(req, res, next),
    );
    router.put(
      '/:id',
      [validateJwt, checkAbility('update', 'Category')],
      (req: Request, res: Response, next: NextFunction) =>
        categoryController.updateCategory(req, res, next),
    );
    router.delete(
      '/:id',
      [validateJwt, checkAbility('delete', 'Category')],
      (req: Request, res: Response, next: NextFunction) =>
        categoryController.deleteCategory(req, res, next),
    );

    return router;
  },
};
