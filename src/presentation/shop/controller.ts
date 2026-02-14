import { NextFunction, Request, Response } from 'express';
import { ShopRepository } from '@domain/repository/shop.repository';
import { CreateShopDTO } from '@application/dtos/shop/create-shop.dto';
import { validate } from 'class-validator';
import { CreateShop } from '@application/uses-cases/shop/create-shop';
import { badRequest, internalError, notFound } from '@presentation/helpers/http-error.helper';
import { UpdateShopDTO } from '@application/dtos/shop/update-shop.dto';
import { UpdateShop } from '@application/uses-cases/shop/update-shop';
import { plainToClass } from 'class-transformer';
import { EntityNotFoundError } from 'typeorm';
import { QueryFilterDTO } from '@infrastructure/http/dto/query-filter.dto';
import { SearchShop } from '@application/uses-cases/shop/search-shop';
import { queryMapper } from '@application/mappers/query-filter.mapper';
import { SHOP_ALLOWED_FIELDS, SHOP_ALLOWED_OPERATIONS } from '@application/queries/shop/shop-where';
import { FindShopsByProximity } from '@application/uses-cases/shop/find-shops-by-proximity';
import { DeleteShop } from '@application/uses-cases/shop/delete-shop';

export class ShopController {
  private readonly createShop: CreateShop;
  private readonly updateShop: UpdateShop;
  private readonly searchShop: SearchShop;
  private readonly deleteShop: DeleteShop;
  private readonly findShopsByProximity: FindShopsByProximity;

  constructor(private readonly repository: ShopRepository) {
    this.createShop = new CreateShop(repository);
    this.updateShop = new UpdateShop(repository);
    this.searchShop = new SearchShop(repository);
    this.deleteShop = new DeleteShop(repository);
    this.findShopsByProximity = new FindShopsByProximity(repository);
  }

  searchShops = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToClass(QueryFilterDTO, req.query);

      const validationErrors = await validate(dto, {
        whitelist: true,
        validationError: { target: false, value: false },
      });

      if (validationErrors.length) {
        return next(badRequest('Validation failed', validationErrors));
      }

      const shops = await this.searchShop.execute(
        queryMapper(dto, {
          allowedFields: SHOP_ALLOWED_FIELDS,
          allowedOperations: SHOP_ALLOWED_OPERATIONS,
        }),
      );
      res.status(200).json(shops);
    } catch (error) {
      console.log(error);
      return next(internalError('Internal server error'));
    }
  };

  createShopHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
      const shop = await this.createShop.execute(dto);
      res.status(201).json(shop);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      return next(internalError('Error creating shop'));
    }
  };

  /**
   * GET /shops/nearby?lat=X&long=Y&radius=Z
   * Busca shops cercanos a una ubicación dada
   */
  nearby = async (req: Request, res: Response): Promise<void> => {
    const latitude = Number(req.query.lat);
    const longitude = Number(req.query.long);
    const radiusKm = Number(req.query.radius) || 10; // Default 10km

    if (isNaN(latitude) || isNaN(longitude)) {
      res.status(400).json({
        error: 'Invalid coordinates. Both lat and long query parameters are required.',
      });
      return;
    }

    if (isNaN(radiusKm) || radiusKm <= 0) {
      res.status(400).json({
        error: 'Invalid radius. Must be a positive number.',
      });
      return;
    }

    const shops = await this.findShopsByProximity.execute(latitude, longitude, radiusKm);

    res.status(200).json(shops);
  };

  updateShopHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
      const shop = await this.updateShop.execute(Number(id), dto);
      res.status(200).json(shop);
    } catch (error: unknown) {
      // Manejar EntityNotFoundError de TypeORM
      if (error instanceof EntityNotFoundError) {
        return next(notFound(`Shop with id ${id} not found`));
      }
      return next(internalError('Error updating shop'));
    }
  };
}
