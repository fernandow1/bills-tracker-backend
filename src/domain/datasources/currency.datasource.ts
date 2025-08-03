import { Currency } from '@domain/entities/currency.entity';

export abstract class CurrencyDataSource {
  abstract getCurrencies(): Promise<Currency[]>;
  abstract createCurrency(currencyData: Currency): Promise<Currency>;
  abstract updateCurrency(id: number, currencyData: Partial<Currency>): Promise<Currency>;
  abstract deleteCurrency(id: number): Promise<void>;
}
