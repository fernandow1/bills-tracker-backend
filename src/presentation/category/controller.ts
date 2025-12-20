import { AppError } from '@application/errors/app-error';
import { CreateCategory } from '@application/uses-cases/category/create-category';
import { GetCategories } from '@application/uses-cases/category/get-categories';
import { CreateCategoryDTO } from '@application/dtos/category/create-category.dto';
import { CategoryRepository } from '@domain/repository/category.repository';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { UpdateCategory } from '@application/uses-cases/category/update-category';
import { DeleteCategory } from '@application/uses-cases/category/delete-category';
import { QueryFilterDTO } from '@infrastructure/http/dto/query-filter.dto';
import { SearchCategory } from '@application/uses-cases/category/search-category';
import { queryMapper } from '@application/mappers/query-filter.mapper';
import {
  CATEGORY_ALLOWED_FIELDS,
  CATEGORY_ALLOWED_OPERATIONS,
} from '@application/queries/category/category-where';

export class CategoryController {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToClass(CreateCategoryDTO, req.body);
      const validationErrors = await validate(dto, {
        whitelist: true,
        validationError: { target: false, value: false },
      });

      if (validationErrors.length) {
        return next(AppError.badRequest('Validation failed', validationErrors));
      }

      const category = await new CreateCategory(this.categoryRepository).execute(dto);
      res.status(201).json(category);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(AppError.internalError('Internal server error'));
    }
  };

  getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await new GetCategories(this.categoryRepository).execute();
      res.status(200).json(categories);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(AppError.internalError('Internal server error'));
    }
  };

  searchCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToClass(QueryFilterDTO, req.query);

      const validationErrors = await validate(dto, {
        whitelist: true,
        validationError: { target: false, value: false },
      });

      if (validationErrors.length) {
        return next(AppError.badRequest('Validation failed', validationErrors));
      }

      const categories = await new SearchCategory(this.categoryRepository).execute(
        queryMapper(dto, {
          allowedFields: CATEGORY_ALLOWED_FIELDS,
          allowedOperations: CATEGORY_ALLOWED_OPERATIONS,
        }),
      );
      res.status(200).json(categories);
    } catch (error) {
      console.log(error);
      return next(AppError.internalError('Internal server error'));
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const dto = plainToClass(CreateCategoryDTO, req.body);
      const validationErrors = await validate(dto, {
        whitelist: true,
        validationError: { target: false, value: false },
      });

      if (validationErrors.length) {
        return next(AppError.badRequest('Validation failed', validationErrors));
      }

      const categoryUpdated = await new UpdateCategory(this.categoryRepository).execute(id, dto);
      res.status(200).json(categoryUpdated);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(AppError.internalError('Internal server error'));
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      await new DeleteCategory(this.categoryRepository).execute(id);
      res.status(204).send();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(AppError.internalError('Internal server error'));
    }
  };
}
