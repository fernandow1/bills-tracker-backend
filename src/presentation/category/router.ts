import { CategoryDataSourceImpl } from '@infrastructure/datasource/category/category.datasource.impl';
import { CategoryRepositoryImpl } from '@infrastructure/repositories/category/category.repository.impl';
import { NextFunction, Request, Response, Router } from 'express';
import { DataSource } from 'typeorm';
import { CategoryController } from '@presentation/category/controller';
import { validateJwt } from '@infrastructure/http/middlewares/validate-jwt.middleware';

/* eslint-disable @typescript-eslint/naming-convention */
export const CategoryRouter = {
  routes(dataSource: DataSource): Router {
    const router = Router();

    const categoryDataSource = new CategoryDataSourceImpl(dataSource);
    const categoryRepository = new CategoryRepositoryImpl(categoryDataSource);

    const categoryController = new CategoryController(categoryRepository);

    router.post('/', [validateJwt], (req: Request, res: Response, next: NextFunction) =>
      categoryController.createCategory(req, res, next),
    );
    router.get('/', [validateJwt], (req: Request, res: Response, next: NextFunction) =>
      categoryController.getAllCategories(req, res, next),
    );
    router.put('/:id', [validateJwt], (req: Request, res: Response, next: NextFunction) =>
      categoryController.updateCategory(req, res, next),
    );
    router.delete('/:id', [validateJwt], (req: Request, res: Response, next: NextFunction) =>
      categoryController.deleteCategory(req, res, next),
    );

    return router;
  },
};
