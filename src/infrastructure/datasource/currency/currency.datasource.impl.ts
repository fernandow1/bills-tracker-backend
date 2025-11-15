import { CurrencyDataSource } from '@domain/datasources/currency.datasource';
import { Currency } from '@infrastructure/database/entities/currency.entity';
import { DataSource } from 'typeorm';

export class CurrencyDataSourceImpl implements CurrencyDataSource {
  constructor(private readonly dataSource: DataSource) {
    // No necesita super() porque CurrencyDataSource es una interface
  }

  async getCurrencies(): Promise<Currency[]> {
    const currencies = await this.dataSource.getRepository(Currency).find();
    return currencies;
  }

  async createCurrency(currencyData: Partial<Currency>): Promise<Currency> {
    return this.dataSource.getRepository(Currency).save(currencyData);
  }

  async updateCurrency(id: number, currencyData: Partial<Currency>): Promise<Currency> {
    // Usar findOneOrFail como en Shop para verificar existencia
    const existingCurrency = await this.dataSource.getRepository(Currency).findOneOrFail({
      where: { id },
    });

    // Merge los datos como en Shop usando el método merge de TypeORM
    this.dataSource.getRepository(Currency).merge(existingCurrency, currencyData);
    return this.dataSource.getRepository(Currency).save(existingCurrency);
  }

  async deleteCurrency(id: number): Promise<void> {
    // Usar softDelete como en Shop para borrado lógico
    await this.dataSource.getRepository(Currency).softDelete(id);
  }
}
