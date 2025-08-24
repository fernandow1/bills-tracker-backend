import { CategoryDataSourceImpl } from '@infrastructure/datasource/category/category.datasource.impl';
import { CategoryRepositoryImpl } from '@infrastructure/repositories/category/category.repository.impl';
import { NextFunction, Request, Response, Router } from 'express';
import { CategoryController } from '@presentation/category/controller';

/* eslint-disable @typescript-eslint/naming-convention */
export const CategoryRouter = {
  routes(): Router {
    const router = Router();

    const categoryDataSource = new CategoryDataSourceImpl();
    const categoryRepository = new CategoryRepositoryImpl(categoryDataSource);

    const categoryController = new CategoryController(categoryRepository);

    router.post('/', (req: Request, res: Response, next: NextFunction) =>
      categoryController.createCategory(req, res, next),
    );
    router.get('/', (req: Request, res: Response, next: NextFunction) =>
      categoryController.getAllCategories(req, res, next),
    );

    return router;
  },
};
