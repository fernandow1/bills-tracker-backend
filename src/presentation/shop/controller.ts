import { Request, Response } from 'express';
import { ShopRepository } from '../../domain/repository/shop.repository';
import { GetShops } from '../../domain/uses-cases/shop/get-shop';
import { CreateShopDTO } from '@/domain/dtos/shop/create-shop.dto';
import { validate, ValidationError } from 'class-validator';

export class ShopController {
  constructor(private readonly repository: ShopRepository) {}

  getShops = (req: Request, res: Response): void => {
    new GetShops(this.repository)
      .execute()
      .then((shops) => {
        res.status(200).json(shops);
      })
      .catch((error) => {
        console.error('Error fetching shops:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  };

  createShop = (req: Request, res: Response): void => {
    const dto = Object.assign(new CreateShopDTO(), req.body);
    let errors: ValidationError[] = [];
    validate(dto)
      .then((validationErrors) => {
        errors = validationErrors;
      })
      .catch((error) => {
        console.error('Validation error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      });

    if (errors.length) {
      res.status(400).json({ errors });
      return;
    }
    this.repository
      .createShop(dto)
      .then((shop) => {
        res.status(201).json(shop);
      })
      .catch((error) => {
        console.error('Error creating shop:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  };
}
