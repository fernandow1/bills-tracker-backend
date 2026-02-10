import { badRequest, internalError } from '@presentation/helpers/http-error.helper';
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
import { QueryFilterDTO } from '@infrastructure/http/dto/query-filter.dto';
import { SearchBrand } from '@application/uses-cases/brand/search-brand';
import { queryMapper } from '@application/mappers/query-filter.mapper';
import {
  BRAND_ALLOWED_FIELDS,
  BRAND_ALLOWED_OPERATIONS,
} from '@application/queries/brand/brand-where';

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
        return next(badRequest('Validation failed', validationErrors));
      }

      const brand = await new CreateBrand(this.brandRepository).execute(dto);
      res.status(201).json(brand);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(internalError('Internal server error'));
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
        return next(badRequest('Validation failed', validationErrors));
      }
      const { id } = req.params;
      const updatedBrand = await new UpdateBrand(this.brandRepository).execute(Number(id), dto);
      res.status(200).json(updatedBrand);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(internalError('Internal server error'));
    }
  };

  deleteBrand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      await new DeleteBrand(this.brandRepository).execute(Number(id));

      res.status(204).send();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(internalError('Internal server error'));
    }
  };

  getBrands = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const brands = await new GetBrands(this.brandRepository).execute();
      res.status(200).json(brands);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(internalError('Internal server error'));
    }
  };

  searchBrands = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToClass(QueryFilterDTO, req.query);

      const validationErrors = await validate(dto, {
        whitelist: true,
        validationError: { target: false, value: false },
      });

      if (validationErrors.length) {
        return next(badRequest('Validation failed', validationErrors));
      }

      const brands = await new SearchBrand(this.brandRepository).execute(
        queryMapper(dto, {
          allowedFields: BRAND_ALLOWED_FIELDS,
          allowedOperations: BRAND_ALLOWED_OPERATIONS,
        }),
      );

      res.status(200).json(brands);
    } catch (error) {
      console.log(error);
      return next(internalError('Internal server error'));
    }
  };
}
