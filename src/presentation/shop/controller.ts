import { NextFunction, Request, Response } from 'express';
import { ShopRepository } from '@domain/repository/shop.repository';
import { CreateShopDTO } from '@application/dtos/shop/create-shop.dto';
import { validate } from 'class-validator';
import { CreateShop } from '@application/uses-cases/shop/create-shop';
import { AppError } from '@application/errors/app-error';
import { UpdateShopDTO } from '@application/dtos/shop/update-shop.dto';
import { UpdateShop } from '@application/uses-cases/shop/update-shop';
import { plainToClass } from 'class-transformer';
import { EntityNotFoundError } from 'typeorm';
import { QueryFilterDTO } from '@infrastructure/http/dto/query-filter.dto';
import { SearchShop } from '@application/uses-cases/shop/search-shop';
import { queryMapper } from '@application/mappers/query-filter.mapper';
import { SHOP_ALLOWED_FIELDS, SHOP_ALLOWED_OPERATIONS } from '@application/queries/shop/shop-where';

export class ShopController {
  constructor(private readonly repository: ShopRepository) {}

  searchShops = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToClass(QueryFilterDTO, req.query);

      const validationErrors = await validate(dto, {
        whitelist: true,
        validationError: { target: false, value: false },
      });

      if (validationErrors.length) {
        return next(AppError.badRequest('Validation failed', validationErrors));
      }

      const shops = await new SearchShop(this.repository).execute(
        queryMapper(dto, {
          allowedFields: SHOP_ALLOWED_FIELDS,
          allowedOperations: SHOP_ALLOWED_OPERATIONS,
        }),
      );
      res.status(200).json(shops);
    } catch (error) {
      console.log(error);
      return next(AppError.internalError('Internal server error'));
    }
  };

  createShop = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dto = Object.assign(new CreateShopDTO(), req.body);
    const validationErrors = await validate(dto);

    if (validationErrors.length) {
      res.status(400).json({
        errors: validationErrors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        })),
      });
      return;
    }

    try {
      const shop = await new CreateShop(this.repository).execute(dto);
      res.status(201).json(shop);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      return next(AppError.internalError('Error creating shop'));
    }
  };

  updateShop = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const dto = plainToClass(UpdateShopDTO, req.body);
    const validationErrors = await validate(dto);

    if (validationErrors.length) {
      res.status(400).json({
        errors: validationErrors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        })),
      });
      return;
    }

    try {
      const shop = await new UpdateShop(this.repository).execute(Number(id), dto);
      res.status(200).json(shop);
    } catch (error: unknown) {
      // Manejar EntityNotFoundError de TypeORM
      if (error instanceof EntityNotFoundError) {
        return next(AppError.notFound(`Shop with id ${id} not found`));
      }
      return next(AppError.internalError('Error updating shop'));
    }
  };
}
