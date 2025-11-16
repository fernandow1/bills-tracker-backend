import { DataSource, Repository } from 'typeorm';
import { PaymentMethod } from '../../../domain/entities/payment-method.entity';
import { PaymentMethodRepository } from '../../../domain/repository/payment-method.repository';
import { PaymentMethodDataSource } from '../../../domain/datasources/payment-method.datasource';
import { faker } from '@faker-js/faker';

export function dataSourcePaymentMethodMock(
  repository: jest.Mocked<Repository<PaymentMethod>>,
): jest.Mocked<DataSource> {
  return {
    getRepository: jest.fn().mockImplementation((entity) => {
      if (!entity) throw new Error('Entity not provided');
      return repository;
    }),
  } as unknown as jest.Mocked<DataSource>;
}

export function paymentMethodRepositoryMock(): jest.Mocked<Repository<PaymentMethod>> {
  return {
    find: jest
      .fn()
      .mockResolvedValue([PAYMENT_METHOD_MOCK, PAYMENT_METHOD_MOCK, PAYMENT_METHOD_MOCK]),
    save: jest
      .fn()
      .mockImplementation(
        async (paymentMethodData: Partial<PaymentMethod>): Promise<PaymentMethod> => {
          return {
            id: paymentMethodData.id
              ? paymentMethodData.id
              : faker.datatype.number({ min: 1, max: 1000 }),
            name: paymentMethodData.name ? paymentMethodData.name : faker.commerce.department(),
            description: paymentMethodData.description
              ? paymentMethodData.description
              : faker.lorem.sentence(),
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          } as PaymentMethod;
        },
      ),
    findOneOrFail: jest.fn().mockImplementation(async (options): Promise<PaymentMethod> => {
      return {
        id: options.where.id,
        name: faker.commerce.department(),
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      } as PaymentMethod;
    }),
    create: jest
      .fn()
      .mockImplementation((paymentMethodData: Partial<PaymentMethod>): PaymentMethod => {
        return {
          id: faker.datatype.number({ min: 1, max: 1000 }),
          name: paymentMethodData.name || faker.commerce.department(),
          description: paymentMethodData.description || faker.lorem.sentence(),
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        } as PaymentMethod;
      }),
    merge: jest
      .fn()
      .mockImplementation(
        (existingPaymentMethod: PaymentMethod, paymentMethodData: Partial<PaymentMethod>) => {
          // TypeORM merge() modifica el objeto existingPaymentMethod in-place
          Object.assign(existingPaymentMethod, paymentMethodData);
          return existingPaymentMethod;
        },
      ),
    softDelete: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue({ affected: 1, raw: {} }),
  } as unknown as jest.Mocked<Repository<PaymentMethod>>;
}

export function paymentMethodRepositoryDomainMock(): jest.Mocked<PaymentMethodRepository> {
  return {
    getAllPaymentMethods: jest
      .fn()
      .mockResolvedValue([PAYMENT_METHOD_MOCK, PAYMENT_METHOD_MOCK, PAYMENT_METHOD_MOCK]),
    createPaymentMethod: jest
      .fn()
      .mockImplementation(
        async (paymentMethodData: Partial<PaymentMethod>): Promise<PaymentMethod> => {
          return {
            id: faker.datatype.number({ min: 1, max: 1000 }),
            name: paymentMethodData.name || faker.commerce.department(),
            description: paymentMethodData.description || faker.lorem.sentence(),
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          } as PaymentMethod;
        },
      ),
    updatePaymentMethod: jest
      .fn()
      .mockImplementation(
        async (id: number, paymentMethodData: Partial<PaymentMethod>): Promise<PaymentMethod> => {
          return {
            id,
            name: paymentMethodData.name || faker.commerce.department(),
            description: paymentMethodData.description || faker.lorem.sentence(),
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          } as PaymentMethod;
        },
      ),
    deletePaymentMethod: jest.fn().mockResolvedValue(undefined),
  } as unknown as jest.Mocked<PaymentMethodRepository>;
}

// ✅ Mock para el DataSource del dominio (usado en Repository tests)
export function paymentMethodDataSourceDomainMock(): jest.Mocked<PaymentMethodDataSource> {
  return {
    getAllPaymentMethods: jest
      .fn()
      .mockResolvedValue([PAYMENT_METHOD_MOCK, PAYMENT_METHOD_MOCK, PAYMENT_METHOD_MOCK]),
    createPaymentMethod: jest
      .fn()
      .mockImplementation(
        async (paymentMethodData: Partial<PaymentMethod>): Promise<PaymentMethod> => {
          return {
            id: faker.datatype.number({ min: 1, max: 1000 }),
            name: paymentMethodData.name || faker.commerce.department(),
            description: paymentMethodData.description || faker.lorem.sentence(),
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          } as PaymentMethod;
        },
      ),
    updatePaymentMethod: jest
      .fn()
      .mockImplementation(
        async (id: number, paymentMethodData: Partial<PaymentMethod>): Promise<PaymentMethod> => {
          return {
            id,
            name: paymentMethodData.name || faker.commerce.department(),
            description: paymentMethodData.description || faker.lorem.sentence(),
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          } as PaymentMethod;
        },
      ),
    deletePaymentMethod: jest.fn().mockResolvedValue(undefined),
  } as unknown as jest.Mocked<PaymentMethodDataSource>;
}

// Mock data constante para usar en tests
export const PAYMENT_METHOD_MOCK: PaymentMethod = {
  id: 1,
  name: 'Credit Card',
  description: 'Payment via credit card',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
} as PaymentMethod;

export const PAYMENT_METHOD_MOCK_CASH: PaymentMethod = {
  id: 2,
  name: 'Cash',
  description: 'Cash payment',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
} as PaymentMethod;
