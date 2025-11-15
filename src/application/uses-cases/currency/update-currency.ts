import { Currency } from '@domain/entities/currency.entity';
import { CurrencyRepository } from '@domain/repository/currency.repository';

export interface UpdateCurrency {
  execute(id: number, data: Partial<Currency>): Promise<Currency>;
}

export class UpdateCurrencyUseCase implements UpdateCurrency {
  private currencyRepository: CurrencyRepository;

  constructor(currencyRepository: CurrencyRepository) {
    this.currencyRepository = currencyRepository;
  }

  async execute(id: number, data: Partial<Currency>): Promise<Currency> {
    return this.currencyRepository.updateCurrency(id, data);
  }
}
