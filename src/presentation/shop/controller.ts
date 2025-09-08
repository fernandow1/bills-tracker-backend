import { NextFunction, Request, Response } from 'express';
import { ShopRepository } from '@domain/repository/shop.repository';
import { GetShops } from '@application/uses-cases/shop/get-shop';
import { CreateShopDTO } from '@application/dtos/shop/create-shop.dto';
import { validate } from 'class-validator';
import { CreateShop } from '@application/uses-cases/shop/create-shop';
import { AppError } from '@application/errors/app-error';

export class ShopController {
  constructor(private readonly repository: ShopRepository) {}

  getShops = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const getShops = new GetShops(this.repository);
    try {
      const shops = await getShops.execute();
      res.status(200).json(shops);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      return next(AppError.internalError('Error fetching shops'));
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
}
