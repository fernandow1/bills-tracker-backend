import { AppError } from '@application/errors/app-error';
import { CreateBrand } from '@application/uses-cases/brand/create-brand';
import { GetBrands } from '@application/uses-cases/brand/get-brands';
import { CreateBrandDTO } from '@application/dtos/brand/create-brand.dto';
import { BrandRepository } from '@domain/repository/brand.repository';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { UpdateBrandDTO } from '@application/dtos/brand/update-brand.dto';
import { UpdateBrand } from '@application/uses-cases/brand/update-brand';
import { DeleteBrand } from '@application/uses-cases/brand/delete-brand';

export class BrandController {
  constructor(private readonly brandRepository: BrandRepository) {}

  createBrand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToClass(CreateBrandDTO, req.body);
      const validationErrors = await validate(dto, {
        whitelist: true,
        validationError: { target: false, value: false },
      });

      if (validationErrors.length) {
        console.log(validationErrors);
        return next(AppError.badRequest('Validation failed', validationErrors));
      }

      const brand = await new CreateBrand(this.brandRepository).execute(dto);
      res.status(201).json(brand);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(AppError.internalError('Internal server error'));
    }
  };

  updateBrand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToClass(UpdateBrandDTO, req.body);
      const validationErrors = await validate(dto, {
        whitelist: true,
        validationError: { target: false, value: false },
      });

      if (validationErrors.length) {
        console.log(validationErrors);
        return next(AppError.badRequest('Validation failed', validationErrors));
      }
      const { id } = req.params;
      const updatedBrand = await new UpdateBrand(this.brandRepository).execute(Number(id), dto);
      res.status(200).json(updatedBrand);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(AppError.internalError('Internal server error'));
    }
  };

  deleteBrand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      await new DeleteBrand(this.brandRepository).execute(Number(id));

      res.status(204).send();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(AppError.internalError('Internal server error'));
    }
  };

  getBrands = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const brands = await new GetBrands(this.brandRepository).execute();
      res.status(200).json(brands);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(AppError.internalError('Internal server error'));
    }
  };
}
