import { CurrencyRepository } from '@domain/repository/currency.repository';

export interface DeleteCurrency {
  execute(id: number): Promise<void>;
}

export class DeleteCurrencyUseCase implements DeleteCurrency {
  private currencyRepository: CurrencyRepository;

  constructor(currencyRepository: CurrencyRepository) {
    this.currencyRepository = currencyRepository;
  }

  async execute(id: number): Promise<void> {
    return this.currencyRepository.deleteCurrency(id);
  }
}
