import { Currency } from '@domain/entities/currency.entity';
import { CurrencyRepository } from '@domain/repository/currency.repository';

export interface CreateCurrencyUseCase {
  execute(currencyData: Partial<Currency>): Promise<Currency>;
}

export class CreateCurrency {
  constructor(private currencyRepository: CurrencyRepository) {
    this.currencyRepository = currencyRepository;
  }

  async execute(currencyData: Partial<Currency>): Promise<Currency> {
    return this.currencyRepository.createCurrency(currencyData);
  }
}
