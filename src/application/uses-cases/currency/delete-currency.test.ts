import { faker } from '@faker-js/faker';
import { currencyRepositoryDomainMock } from '../../../infrastructure/datasource/currency/currency.mock';
import { DeleteCurrencyUseCase } from './delete-currency';

describe('Delete Currency Use Case', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('should delete a currency successfully', async () => {
    const id = faker.datatype.number({ min: 1, max: 1000 });
    const repositoryMock = currencyRepositoryDomainMock();
    const deleteCurrencyUseCase = new DeleteCurrencyUseCase(repositoryMock);

    await deleteCurrencyUseCase.execute(id);
    expect(repositoryMock.deleteCurrency).toHaveBeenCalledTimes(1);
    expect(repositoryMock.deleteCurrency).toHaveBeenCalledWith(id);
  });

  test('Should propagate error when repository fails', async () => {
    const id = faker.datatype.number({ min: 1, max: 1000 });
    const repositoryMock = currencyRepositoryDomainMock();
    repositoryMock.deleteCurrency.mockRejectedValueOnce(new Error('Database error'));
    const deleteCurrencyUseCase = new DeleteCurrencyUseCase(repositoryMock);

    await expect(deleteCurrencyUseCase.execute(id)).rejects.toThrow('Database error');
    expect(repositoryMock.deleteCurrency).toHaveBeenCalledTimes(1);
  });
});
