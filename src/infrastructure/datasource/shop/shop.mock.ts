import { DataSource, Repository } from 'typeorm';
import { Shop } from '../../../domain/entities/shop.entity';
import { ShopRepository } from '../../../domain/repository/shop.repository';
import { ShopDataSource } from '../../../domain/datasources/shop.datasource';
import { faker } from '@faker-js/faker';

export function dataSourceShopMock(
  repository: jest.Mocked<Repository<Shop>>,
): jest.Mocked<DataSource> {
  return {
    getRepository: jest.fn().mockImplementation((entity) => {
      if (!entity) throw new Error('Entity not provided');
      return repository;
    }),
  } as unknown as jest.Mocked<DataSource>;
}

export function shopRepositoryMock(): jest.Mocked<Repository<Shop>> {
  return {
    find: jest.fn().mockResolvedValue([SHOPMOCK, SHOPMOCK, SHOPMOCK]),
    save: jest.fn().mockImplementation(async (shopData: Partial<Shop>): Promise<Shop> => {
      return {
        id: shopData.id ? shopData.id : faker.datatype.number({ min: 1, max: 1000 }),
        name: shopData.name ? shopData.name : faker.company.name(),
        description: shopData.description ? shopData.description : faker.lorem.sentence(),
        latitude: shopData.latitude ? shopData.latitude : faker.address.latitude(),
        longitude: shopData.longitude ? shopData.longitude : faker.address.longitude(),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Shop;
    }),
    findOneOrFail: jest.fn().mockImplementation(async (options): Promise<Shop> => {
      return {
        id: options.where.id,
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        latitude: +faker.address.latitude() as number,
        longitude: +faker.address.longitude() as number,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Shop;
    }),
    merge: jest.fn().mockImplementation((existingShop: Shop, shopData: Partial<Shop>) => {
      // TypeORM merge() modifica el objeto existingShop in-place
      Object.assign(existingShop, shopData);
      return existingShop;
    }),
    softDelete: jest.fn().mockResolvedValue(undefined),
  } as unknown as jest.Mocked<Repository<Shop>>;
}

export function shopRepositoryDomainMock(): jest.Mocked<ShopRepository> {
  return {
    search: jest.fn(),
    findAll: jest.fn().mockResolvedValue([SHOPMOCK, SHOPMOCK, SHOPMOCK]),
    createShop: jest.fn().mockImplementation(async (shopData: Partial<Shop>): Promise<Shop> => {
      return new Shop(
        faker.datatype.number({ min: 1, max: 1000 }),
        shopData.name || faker.company.name(),
        shopData.description || faker.lorem.sentence(),
        shopData.latitude ?? +faker.address.latitude(),
        shopData.longitude ?? +faker.address.longitude(),
      );
    }),
    updateShop: jest.fn().mockImplementation(async (id: number, shopData: Partial<Shop>): Promise<Shop> => {
      return new Shop(
        id,
        shopData.name || faker.company.name(),
        shopData.description || faker.lorem.sentence(),
        shopData.latitude ?? +faker.address.latitude(),
        shopData.longitude ?? +faker.address.longitude(),
      );
    }),
    deleteShop: jest.fn().mockResolvedValue(undefined),
  } as unknown as jest.Mocked<ShopRepository>;
}

// ✅ NUEVO: Mock para el DataSource del dominio (usado en Repository tests)
export function shopDataSourceDomainMock(): jest.Mocked<ShopDataSource> {
  return {
    search: jest.fn(),
    findAll: jest.fn().mockResolvedValue([SHOPMOCK, SHOPMOCK, SHOPMOCK]),
    createShop: jest.fn().mockImplementation(async (shopData: Partial<Shop>): Promise<Shop> => {
      return new Shop(
        faker.datatype.number({ min: 1, max: 1000 }),
        shopData.name || faker.company.name(),
        shopData.description || faker.lorem.sentence(),
        shopData.latitude ?? +faker.address.latitude(),
        shopData.longitude ?? +faker.address.longitude(),
      );
    }),
    updateShop: jest
      .fn()
      .mockImplementation(async (id: number, shopData: Partial<Shop>): Promise<Shop> => {
        return new Shop(
          id,
          shopData.name || faker.company.name(),
          shopData.description || faker.lorem.sentence(),
          shopData.latitude ?? +faker.address.latitude(),
          shopData.longitude ?? +faker.address.longitude(),
        );
      }),
    deleteShop: jest.fn().mockResolvedValue(undefined),
  } as unknown as jest.Mocked<ShopDataSource>;
}

export const SHOPMOCK: Shop = new Shop(
  faker.datatype.number({ min: 1, max: 1000 }),
  faker.company.name(),
  faker.lorem.sentence(),
  +faker.address.latitude() as number,
  +faker.address.longitude() as number,
);
