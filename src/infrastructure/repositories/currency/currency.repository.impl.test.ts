import { CurrencyRepositoryImpl } from './currency.repository.impl';
import { CurrencyDataSource } from '../../../domain/datasources/currency.datasource';
import { Currency } from '../../../domain/entities/currency.entity';
import {
  CURRENCY_MOCK,
  currencyDataSourceDomainMock,
} from '../../datasource/currency/currency.mock';

describe('CurrencyRepositoryImpl', () => {
  let mockDataSource: jest.Mocked<CurrencyDataSource>;
  let repository: CurrencyRepositoryImpl;

  beforeEach(() => {
    mockDataSource = currencyDataSourceDomainMock();
    repository = new CurrencyRepositoryImpl(mockDataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrencies', () => {
    test('should delegate to datasource and return currencies', async () => {
      const mockCurrencies: Currency[] = [CURRENCY_MOCK, CURRENCY_MOCK];
      mockDataSource.getCurrencies.mockResolvedValue(mockCurrencies);

      const result = await repository.getCurrencies();

      expect(mockDataSource.getCurrencies).toHaveBeenCalledTimes(1);
      expect(mockDataSource.getCurrencies).toHaveBeenCalledWith();
      expect(result).toBe(mockCurrencies);
    });

    test('should propagate errors from datasource', async () => {
      const error = new Error('Datasource error');
      mockDataSource.getCurrencies.mockRejectedValue(error);

      await expect(repository.getCurrencies()).rejects.toThrow(error);
      expect(mockDataSource.getCurrencies).toHaveBeenCalledTimes(1);
    });
  });

  describe('createCurrency', () => {
    test('should delegate to datasource and return created currency', async () => {
      const currencyData: Partial<Currency> = {
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
      };
      const createdCurrency: Currency = { ...CURRENCY_MOCK, ...currencyData };
      mockDataSource.createCurrency.mockResolvedValue(createdCurrency);

      const result = await repository.createCurrency(currencyData);

      expect(mockDataSource.createCurrency).toHaveBeenCalledTimes(1);
      expect(mockDataSource.createCurrency).toHaveBeenCalledWith(currencyData);
      expect(result).toBe(createdCurrency);
    });

    test('should propagate errors from datasource', async () => {
      const currencyData: Partial<Currency> = { code: 'USD', name: 'US Dollar' };
      const error = new Error('Datasource error');
      mockDataSource.createCurrency.mockRejectedValue(error);

      await expect(repository.createCurrency(currencyData)).rejects.toThrow(error);
      expect(mockDataSource.createCurrency).toHaveBeenCalledTimes(1);
      expect(mockDataSource.createCurrency).toHaveBeenCalledWith(currencyData);
    });
  });

  describe('updateCurrency', () => {
    test('should delegate to datasource and return updated currency', async () => {
      const currencyId = 1;
      const currencyData: Partial<Currency> = {
        name: 'Updated US Dollar',
        symbol: 'USD$',
      };
      const updatedCurrency: Currency = { ...CURRENCY_MOCK, id: currencyId, ...currencyData };
      mockDataSource.updateCurrency.mockResolvedValue(updatedCurrency);

      const result = await repository.updateCurrency(currencyId, currencyData);

      expect(mockDataSource.updateCurrency).toHaveBeenCalledTimes(1);
      expect(mockDataSource.updateCurrency).toHaveBeenCalledWith(currencyId, currencyData);
      expect(result).toBe(updatedCurrency);
    });

    test('should propagate errors from datasource', async () => {
      const currencyId = 1;
      const currencyData: Partial<Currency> = { name: 'Updated Currency' };
      const error = new Error('Datasource error');
      mockDataSource.updateCurrency.mockRejectedValue(error);

      await expect(repository.updateCurrency(currencyId, currencyData)).rejects.toThrow(error);
      expect(mockDataSource.updateCurrency).toHaveBeenCalledTimes(1);
      expect(mockDataSource.updateCurrency).toHaveBeenCalledWith(currencyId, currencyData);
    });
  });

  describe('deleteCurrency', () => {
    test('should delegate to datasource successfully', async () => {
      const currencyId = 1;
      mockDataSource.deleteCurrency.mockResolvedValue(undefined);

      await repository.deleteCurrency(currencyId);

      expect(mockDataSource.deleteCurrency).toHaveBeenCalledTimes(1);
      expect(mockDataSource.deleteCurrency).toHaveBeenCalledWith(currencyId);
    });

    test('should propagate errors from datasource', async () => {
      const currencyId = 1;
      const error = new Error('Datasource error');
      mockDataSource.deleteCurrency.mockRejectedValue(error);

      await expect(repository.deleteCurrency(currencyId)).rejects.toThrow(error);
      expect(mockDataSource.deleteCurrency).toHaveBeenCalledTimes(1);
      expect(mockDataSource.deleteCurrency).toHaveBeenCalledWith(currencyId);
    });
  });
});
