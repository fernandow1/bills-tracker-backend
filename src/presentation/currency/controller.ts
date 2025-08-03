import { CreateCurrencyDto } from '@domain/dtos/currency/create-currency.dto';
import { CurrencyRepository } from '@domain/repository/currency.repository';
import { validate } from 'class-validator';
import { Request, Response } from 'express';

export class CurrencyController {
  constructor(private readonly repository: CurrencyRepository) {}

  getCurrencies = async (req: Request, res: Response): Promise<void> => {
    try {
      const currencies = await this.repository.getCurrencies();
      res.status(200).json(currencies);
    } catch (error) {
      console.error('Error fetching currencies:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  createCurrency = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = Object.assign(new CreateCurrencyDto(), req.body);

      const errors = await validate(dto);
      if (errors.length) {
        res.status(400).json({ errors });
        return;
      }

      const currency = await this.repository.createCurrency(dto);
      res.status(201).json(currency);
    } catch (error) {
      console.error('Error creating currency:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  updateCurrency = async (req: Request, res: Response): Promise<void> => {
    try {
      const currency = await this.repository.updateCurrency(Number(req.params.id), req.body);
      res.status(200).json(currency);
    } catch (error) {
      console.error('Error updating currency:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  deleteCurrency = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.repository.deleteCurrency(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting currency:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}
