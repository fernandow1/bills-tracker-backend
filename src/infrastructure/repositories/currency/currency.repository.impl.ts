import { CurrencyDataSource } from '@domain/datasources/currency.datasource';
import { Currency } from '@domain/entities/currency.entity';
import { CurrencyRepository } from '@domain/repository/currency.repository';

export class CurrencyRepositoryImpl implements CurrencyRepository {
  private currencyDataSource: CurrencyDataSource;

  constructor(currencyDataSource: CurrencyDataSource) {
    this.currencyDataSource = currencyDataSource;
  }

  getCurrencies(): Promise<Currency[]> {
    return this.currencyDataSource.getCurrencies();
  }
  createCurrency(currencyData: Partial<Currency>): Promise<Currency> {
    return this.currencyDataSource.createCurrency(currencyData);
  }
  updateCurrency(id: number, currencyData: Partial<Currency>): Promise<Currency> {
    return this.currencyDataSource.updateCurrency(id, currencyData);
  }
  deleteCurrency(id: number): Promise<void> {
    return this.currencyDataSource.deleteCurrency(id);
  }
}
