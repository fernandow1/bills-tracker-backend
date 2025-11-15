import { dataSourceCurrencyMock, currencyRepositoryMock } from './currency.mock';
import { CurrencyDataSourceImpl } from './currency.datasource.impl';
import { Currency } from '../../database/entities/currency.entity';

describe('CurrencyDatasourceImpl', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('Should retrieve currencies from database successfully', async () => {
    const repositoryMock = currencyRepositoryMock();
    const dataSourceMock = dataSourceCurrencyMock(repositoryMock);
    const dataSourceImpl = new CurrencyDataSourceImpl(dataSourceMock);

    const currencies = await dataSourceImpl.getCurrencies();

    expect(currencies).toBeInstanceOf(Array);
    expect(currencies.length).toBeGreaterThan(0);
    currencies.forEach((currency) => {
      expect(currency).toHaveProperty('id');
      expect(currency).toHaveProperty('code');
      expect(currency).toHaveProperty('name');
      expect(currency).toHaveProperty('symbol');
    });
    expect(dataSourceMock.getRepository).toHaveBeenCalledTimes(1);
    expect(dataSourceMock.getRepository).toHaveBeenCalledWith(Currency);
    expect(repositoryMock.find).toHaveBeenCalled();
  });

  test('Should propagate error when retrieving currencies fails', async () => {
    const repositoryMock = currencyRepositoryMock();
    repositoryMock.find.mockRejectedValueOnce(new Error('Database error'));
    const dataSourceMock = dataSourceCurrencyMock(repositoryMock);
    const dataSourceImpl = new CurrencyDataSourceImpl(dataSourceMock);

    await expect(dataSourceImpl.getCurrencies()).rejects.toThrow(new Error('Database error'));
    expect(dataSourceMock.getRepository).toHaveBeenCalledTimes(1);
    expect(dataSourceMock.getRepository).toHaveBeenCalledWith(Currency);
    expect(repositoryMock.find).toHaveBeenCalled();
  });

  test('Should create currency in database successfully', async () => {
    const repositoryMock = currencyRepositoryMock();
    const dataSourceMock = dataSourceCurrencyMock(repositoryMock);
    const dataSourceImpl = new CurrencyDataSourceImpl(dataSourceMock);

    const newCurrency = await dataSourceImpl.createCurrency({
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
    });

    expect(newCurrency).toBeDefined();
    expect(dataSourceMock.getRepository).toHaveBeenCalledWith(Currency);
    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    expect(repositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'USD', name: 'US Dollar', symbol: '$' }),
    );
  });

  test('Should propagate error when creating currency fails', async () => {
    const repositoryMock = currencyRepositoryMock();
    repositoryMock.save.mockRejectedValueOnce(new Error('Database error'));
    const dataSourceMock = dataSourceCurrencyMock(repositoryMock);
    const dataSourceImpl = new CurrencyDataSourceImpl(dataSourceMock);

    await expect(
      dataSourceImpl.createCurrency({
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
      }),
    ).rejects.toThrow(new Error('Database error'));
  });

  test('Should update currency in database successfully', async () => {
    const repositoryMock = currencyRepositoryMock();
    const dataSourceMock = dataSourceCurrencyMock(repositoryMock);
    const dataSourceImpl = new CurrencyDataSourceImpl(dataSourceMock);

    const updatedCurrency = await dataSourceImpl.updateCurrency(1, {
      name: 'Updated US Dollar',
      symbol: 'USD$',
    });

    expect(updatedCurrency).toBeDefined();
    expect(dataSourceMock.getRepository).toHaveBeenCalledWith(Currency);

    // Verificar que findOneOrFail fue llamado correctamente
    expect(repositoryMock.findOneOrFail).toHaveBeenCalledWith({ where: { id: 1 } });

    // Verificar que merge fue llamado correctamente
    expect(repositoryMock.merge).toHaveBeenCalledTimes(1);

    // Verificar que save fue llamado con el objeto mergeado
    expect(repositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        name: 'Updated US Dollar',
        symbol: 'USD$',
      }),
    );
  });

  test('Should propagate error when updating currency fails', async () => {
    const repositoryMock = currencyRepositoryMock();
    repositoryMock.save.mockRejectedValueOnce(new Error('Database error'));
    const dataSourceMock = dataSourceCurrencyMock(repositoryMock);
    const dataSourceImpl = new CurrencyDataSourceImpl(dataSourceMock);

    await expect(
      dataSourceImpl.updateCurrency(1, {
        name: 'Updated Currency',
      }),
    ).rejects.toThrow(new Error('Database error'));
  });

  test('Should delete currency in database successfully', async () => {
    const repositoryMock = currencyRepositoryMock();
    const dataSourceMock = dataSourceCurrencyMock(repositoryMock);
    const dataSourceImpl = new CurrencyDataSourceImpl(dataSourceMock);

    await dataSourceImpl.deleteCurrency(1);

    expect(dataSourceMock.getRepository).toHaveBeenCalledWith(Currency);
    expect(repositoryMock.softDelete).toHaveBeenCalledWith(1);
    expect(repositoryMock.softDelete).toHaveBeenCalledTimes(1);
  });

  test('Should propagate error when deleting currency fails', async () => {
    const repositoryMock = currencyRepositoryMock();
    repositoryMock.softDelete.mockRejectedValueOnce(new Error('Database error'));
    const dataSourceMock = dataSourceCurrencyMock(repositoryMock);
    const dataSourceImpl = new CurrencyDataSourceImpl(dataSourceMock);

    await expect(dataSourceImpl.deleteCurrency(1)).rejects.toThrow(new Error('Database error'));
  });
});
