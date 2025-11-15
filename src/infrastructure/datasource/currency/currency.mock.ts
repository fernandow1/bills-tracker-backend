import { DataSource, Repository } from 'typeorm';
import { Currency } from '../../../domain/entities/currency.entity';
import { CurrencyRepository } from '../../../domain/repository/currency.repository';
import { CurrencyDataSource } from '../../../domain/datasources/currency.datasource';
import { faker } from '@faker-js/faker';

export function dataSourceCurrencyMock(
  repository: jest.Mocked<Repository<Currency>>,
): jest.Mocked<DataSource> {
  return {
    getRepository: jest.fn().mockImplementation((entity) => {
      if (!entity) throw new Error('Entity not provided');
      return repository;
    }),
  } as unknown as jest.Mocked<DataSource>;
}

export function currencyRepositoryMock(): jest.Mocked<Repository<Currency>> {
  return {
    find: jest.fn().mockResolvedValue([CURRENCY_MOCK, CURRENCY_MOCK, CURRENCY_MOCK]),
    save: jest
      .fn()
      .mockImplementation(async (currencyData: Partial<Currency>): Promise<Currency> => {
        return {
          id: currencyData.id ? currencyData.id : faker.datatype.number({ min: 1, max: 1000 }),
          code: currencyData.code ? currencyData.code : faker.finance.currencyCode(),
          name: currencyData.name ? currencyData.name : faker.finance.currencyName(),
          symbol: currencyData.symbol ? currencyData.symbol : faker.finance.currencySymbol(),
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        } as Currency;
      }),
    findOneOrFail: jest.fn().mockImplementation(async (options): Promise<Currency> => {
      return {
        id: options.where.id,
        code: faker.finance.currencyCode(),
        name: faker.finance.currencyName(),
        symbol: faker.finance.currencySymbol(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      } as Currency;
    }),
    merge: jest
      .fn()
      .mockImplementation((existingCurrency: Currency, currencyData: Partial<Currency>) => {
        // TypeORM merge() modifica el objeto existingCurrency in-place
        Object.assign(existingCurrency, currencyData);
        return existingCurrency;
      }),
    softDelete: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue({ affected: 1, raw: {} }),
  } as unknown as jest.Mocked<Repository<Currency>>;
}

export function currencyRepositoryDomainMock(): jest.Mocked<CurrencyRepository> {
  return {
    getCurrencies: jest.fn().mockResolvedValue([CURRENCY_MOCK, CURRENCY_MOCK, CURRENCY_MOCK]),
    createCurrency: jest
      .fn()
      .mockImplementation(async (currencyData: Partial<Currency>): Promise<Currency> => {
        return {
          id: faker.datatype.number({ min: 1, max: 1000 }),
          code: currencyData.code || faker.finance.currencyCode(),
          name: currencyData.name || faker.finance.currencyName(),
          symbol: currencyData.symbol || faker.finance.currencySymbol(),
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        } as Currency;
      }),
    updateCurrency: jest
      .fn()
      .mockImplementation(
        async (id: number, currencyData: Partial<Currency>): Promise<Currency> => {
          return {
            id,
            code: currencyData.code || faker.finance.currencyCode(),
            name: currencyData.name || faker.finance.currencyName(),
            symbol: currencyData.symbol || faker.finance.currencySymbol(),
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          } as Currency;
        },
      ),
    deleteCurrency: jest.fn().mockResolvedValue(undefined),
  } as unknown as jest.Mocked<CurrencyRepository>;
}

// ✅ NUEVO: Mock para el DataSource del dominio (usado en Repository tests)
export function currencyDataSourceDomainMock(): jest.Mocked<CurrencyDataSource> {
  return {
    getCurrencies: jest.fn().mockResolvedValue([CURRENCY_MOCK, CURRENCY_MOCK, CURRENCY_MOCK]),
    createCurrency: jest
      .fn()
      .mockImplementation(async (currencyData: Partial<Currency>): Promise<Currency> => {
        return {
          id: faker.datatype.number({ min: 1, max: 1000 }),
          code: currencyData.code || faker.finance.currencyCode(),
          name: currencyData.name || faker.finance.currencyName(),
          symbol: currencyData.symbol || faker.finance.currencySymbol(),
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        } as Currency;
      }),
    updateCurrency: jest
      .fn()
      .mockImplementation(
        async (id: number, currencyData: Partial<Currency>): Promise<Currency> => {
          return {
            id,
            code: currencyData.code || faker.finance.currencyCode(),
            name: currencyData.name || faker.finance.currencyName(),
            symbol: currencyData.symbol || faker.finance.currencySymbol(),
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          } as Currency;
        },
      ),
    deleteCurrency: jest.fn().mockResolvedValue(undefined),
  } as unknown as jest.Mocked<CurrencyDataSource>;
}

// Mock data constante para usar en tests
export const CURRENCY_MOCK: Currency = {
  id: 1,
  code: 'USD',
  name: 'US Dollar',
  symbol: '$',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
} as Currency;

export const CURRENCY_MOCK_EUR: Currency = {
  id: 2,
  code: 'EUR',
  name: 'Euro',
  symbol: '€',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
} as Currency;

export const CURRENCY_MOCK_ARS: Currency = {
  id: 3,
  code: 'ARS',
  name: 'Argentine Peso',
  symbol: '$',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
} as Currency;
