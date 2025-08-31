import { AppError } from '@application/errors/app-error';
import { CreateProduct } from '@application/uses-cases/product/create-product';
import { DeleteProduct } from '@application/uses-cases/product/delete-product';
import { GetProduct } from '@application/uses-cases/product/get-product';
import { GetProducts } from '@application/uses-cases/product/get-products';
import { UpdateProduct } from '@application/uses-cases/product/update-product';
import { CreateProductDTO } from '@domain/dtos/product/create-product.dto';
import { UpdateProductDTO } from '@domain/dtos/product/update-product.dto';
import { ProductRepository } from '@domain/repository/product.repository';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export class ProductController {
  constructor(private readonly productRepository: ProductRepository) {}

  getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const products = await new GetProducts(this.productRepository).execute();
      res.status(200).json(products);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(AppError.internalError('Internal server error'));
    }
  };

  getProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = req.params.id;
      const product = await new GetProduct(this.productRepository).execute(Number(productId));
      res.status(200).json(product);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(AppError.internalError('Internal server error'));
    }
  };

  createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToClass(CreateProductDTO, req.body);

      const validationErrors = await validate(dto, {
        whitelist: true,
        validationError: { target: false, value: false },
      });

      if (validationErrors.length) {
        return next(AppError.badRequest('Validation failed', validationErrors));
      }

      const product = await new CreateProduct(this.productRepository).execute(dto);
      res.status(201).json(product);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(AppError.internalError('Internal server error'));
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = req.params.id;
      const dto = plainToClass(UpdateProductDTO, req.body);

      const validationErrors = await validate(dto, {
        whitelist: true,
        validationError: { target: false, value: false },
      });

      if (validationErrors.length) {
        return next(AppError.badRequest('Validation failed', validationErrors));
      }

      const product = await new UpdateProduct(this.productRepository).execute(
        Number(productId),
        dto,
      );
      res.status(200).json(product);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(AppError.internalError('Internal server error'));
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = req.params.id;
      await new DeleteProduct(this.productRepository).execute(Number(productId));
      res.status(204).send();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(AppError.internalError('Internal server error'));
    }
  };
}
