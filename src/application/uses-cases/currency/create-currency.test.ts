import { CreateCurrency } from './create-currency';
import { currencyRepositoryDomainMock } from '../../../infrastructure/datasource/currency/currency.mock';

describe('Create Currency Use Case', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('should create a new currency successfully', async () => {
    const repositoryMock = currencyRepositoryDomainMock();
    const createCurrencyUseCase = new CreateCurrency(repositoryMock);

    const result = await createCurrencyUseCase.execute({
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
    });

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('code', 'USD');
    expect(result).toHaveProperty('name', 'US Dollar');
    expect(result).toHaveProperty('symbol', '$');
    expect(repositoryMock.createCurrency).toHaveBeenCalledTimes(1);
    expect(repositoryMock.createCurrency).toHaveBeenCalledWith({
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
    });
  });

  test('Should propagate error when repository fails', async () => {
    const repositoryMock = currencyRepositoryDomainMock();
    repositoryMock.createCurrency.mockRejectedValueOnce(new Error('Database error'));
    const createCurrencyUseCase = new CreateCurrency(repositoryMock);

    await expect(
      createCurrencyUseCase.execute({
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
      }),
    ).rejects.toThrow('Database error');
    expect(repositoryMock.createCurrency).toHaveBeenCalledTimes(1);
  });
});
