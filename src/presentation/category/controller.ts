import { AppError } from '@application/errors/app-error';
import { CreateCategory } from '@application/uses-cases/cateogry/create-category';
import { GetCategories } from '@application/uses-cases/cateogry/get-categories';
import { CreateCategoryDTO } from '@application/dtos/category/create-category.dto';
import { CategoryRepository } from '@domain/repository/category.repository';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

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
}
