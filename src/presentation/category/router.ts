import { CategoryDataSourceImpl } from '@infrastructure/datasource/category/category.datasource.impl';
import { CategoryRepositoryImpl } from '@infrastructure/repositories/category/category.repository.impl';
import { NextFunction, Request, Response, Router } from 'express';
import { CategoryController } from '@presentation/category/controller';
import { TestDataSource } from '@infrastructure/database/connection-test';
import { AppDataSource } from '@infrastructure/database/connection';

/* eslint-disable @typescript-eslint/naming-convention */
export const CategoryRouter = {
  routes(): Router {
    const router = Router();

    const repository = process.env.NODE_ENV === 'test' ? TestDataSource : AppDataSource;
    const categoryDataSource = new CategoryDataSourceImpl(repository);
    const categoryRepository = new CategoryRepositoryImpl(categoryDataSource);

    const categoryController = new CategoryController(categoryRepository);

    router.post('/', (req: Request, res: Response, next: NextFunction) =>
      categoryController.createCategory(req, res, next),
    );
    router.get('/', (req: Request, res: Response, next: NextFunction) =>
      categoryController.getAllCategories(req, res, next),
    );
    router.put('/:id', (req: Request, res: Response, next: NextFunction) =>
      categoryController.updateCategory(req, res, next),
    );
    router.delete('/:id', (req: Request, res: Response, next: NextFunction) =>
      categoryController.deleteCategory(req, res, next),
    );

    return router;
  },
};
