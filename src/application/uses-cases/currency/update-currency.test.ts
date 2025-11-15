import { currencyRepositoryDomainMock } from '../../../infrastructure/datasource/currency/currency.mock';
import { UpdateCurrencyUseCase } from './update-currency';
import { faker } from '@faker-js/faker';

describe('Update Currency Use Case', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('should update a currency successfully', async () => {
    const id = faker.datatype.number({ min: 1, max: 1000 });
    const repositoryMock = currencyRepositoryDomainMock();
    const updateCurrencyUseCase = new UpdateCurrencyUseCase(repositoryMock);
    const result = await updateCurrencyUseCase.execute(id, {
      name: 'Updated Dollar',
      symbol: '$',
    });
    expect(result).toHaveProperty('id', id);
    expect(result).toHaveProperty('name', 'Updated Dollar');
    expect(result).toHaveProperty('symbol', '$');
  });

  test('Should propagate error when repository fails', async () => {
    const id = faker.datatype.number({ min: 1, max: 1000 });
    const repositoryMock = currencyRepositoryDomainMock();
    repositoryMock.updateCurrency.mockRejectedValueOnce(new Error('Database error'));
    const updateCurrencyUseCase = new UpdateCurrencyUseCase(repositoryMock);

    await expect(
      updateCurrencyUseCase.execute(id, {
        name: 'Updated Dollar',
        symbol: '$',
      }),
    ).rejects.toThrow(new Error('Database error'));
    await expect(repositoryMock.updateCurrency).rejects.toBeInstanceOf(Error);
  });
});
