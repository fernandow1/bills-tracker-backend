import { GetCurrencies } from './get-currencies';
import { currencyRepositoryDomainMock } from '../../../infrastructure/datasource/currency/currency.mock';

describe('Get Currencies Use Case', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('should return a list of currencies', async () => {
    const repositoryMock = currencyRepositoryDomainMock();
    const currencies = await new GetCurrencies(repositoryMock).execute();

    expect(currencies).toBeInstanceOf(Array);
    expect(currencies.length).toBeGreaterThan(0);
    currencies.forEach((currency) => {
      expect(currency).toHaveProperty('id');
      expect(currency).toHaveProperty('code');
      expect(currency).toHaveProperty('name');
      expect(currency).toHaveProperty('symbol');
    });
  });

  test('Should propagate error when repository fails', async () => {
    const repositoryMock = currencyRepositoryDomainMock();
    repositoryMock.getCurrencies.mockRejectedValueOnce(new Error('Database error'));
    const getCurrenciesUseCase = new GetCurrencies(repositoryMock);

    await expect(getCurrenciesUseCase.execute()).rejects.toThrow('Database error');
    expect(repositoryMock.getCurrencies).toHaveBeenCalledTimes(1);
  });
});
