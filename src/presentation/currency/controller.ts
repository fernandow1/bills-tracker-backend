import { NextFunction, Request, Response } from 'express';
import { CurrencyRepository } from '@domain/repository/currency.repository';
import { CreateCurrencyDto } from '@application/dtos/currency/create-currency.dto';
import { validate } from 'class-validator';
import { internalError, notFound } from '@presentation/helpers/http-error.helper';
import { plainToClass } from 'class-transformer';
import { EntityNotFoundError } from 'typeorm';
import { UpdateCurrencyDto } from '@application/dtos/currency/update-currency.dto';
import { UpdateCurrencyUseCase } from '@application/uses-cases/currency/update-currency';
import { DeleteCurrencyUseCase } from '@application/uses-cases/currency/delete-currency';

export class CurrencyController {
  constructor(private readonly repository: CurrencyRepository) {}

  getCurrencies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const currencies = await this.repository.getCurrencies();
      res.status(200).json(currencies);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      return next(internalError('Error fetching currencies'));
    }
  };

  createCurrency = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dto = plainToClass(CreateCurrencyDto, req.body);
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
      const currency = await this.repository.createCurrency(dto);
      res.status(201).json(currency);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      return next(internalError('Error creating currency'));
    }
  };

  updateCurrency = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const dto = plainToClass(UpdateCurrencyDto, req.body);
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
      const currency = await new UpdateCurrencyUseCase(this.repository).execute(Number(id), dto);
      res.status(200).json(currency);
    } catch (error: unknown) {
      // Manejar EntityNotFoundError de TypeORM
      if (error instanceof EntityNotFoundError) {
        return next(notFound(`Currency with id ${id} not found`));
      }
      return next(internalError('Error updating currency'));
    }
  };

  deleteCurrency = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    try {
      await new DeleteCurrencyUseCase(this.repository).execute(Number(id));
      res.status(204).send();
    } catch (error: unknown) {
      // Manejar EntityNotFoundError de TypeORM
      if (error instanceof EntityNotFoundError) {
        return next(notFound(`Currency with id ${id} not found`));
      }
      return next(internalError('Error deleting currency'));
    }
  };
}
