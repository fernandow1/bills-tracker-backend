import { Currency } from '@domain/entities/currency.entity';
import { CurrencyRepository } from '@domain/repository/currency.repository';

export interface CreateCurrencyUseCase {
  execute(): Promise<Currency[]>;
}

export class GetCurrencies implements CreateCurrencyUseCase {
  private currencyRepository: CurrencyRepository;

  constructor(currencyRepository: CurrencyRepository) {
    this.currencyRepository = currencyRepository;
  }

  async execute(): Promise<Currency[]> {
    return this.currencyRepository.getCurrencies();
  }
}
