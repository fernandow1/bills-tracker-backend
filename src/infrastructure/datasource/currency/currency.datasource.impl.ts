import { CurrencyDataSource } from '@domain/datasources/currency.datasource';
import { AppDataSource } from '@infrastructure/database/connection';
import { Currency } from '@infrastructure/database/entities/currency.entity';

export class CurrencyDataSourceImpl implements CurrencyDataSource {
  async getCurrencies(): Promise<Currency[]> {
    const currencies = await AppDataSource.getRepository(Currency).find();
    return currencies;
  }

  async createCurrency(currencyData: Partial<Currency>): Promise<Currency> {
    return AppDataSource.getRepository(Currency).save(currencyData);
  }

  async updateCurrency(id: number, currencyData: Partial<Currency>): Promise<Currency> {
    const currency = { id, ...currencyData };
    return AppDataSource.getRepository(Currency).save(currency);
  }

  async deleteCurrency(id: number): Promise<void> {
    await AppDataSource.getRepository(Currency).delete(id);
  }
}
