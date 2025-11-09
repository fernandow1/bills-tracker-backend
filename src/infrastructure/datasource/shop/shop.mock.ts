import { DataSource, Repository } from 'typeorm';
import { Shop } from '../../../domain/entities/shop.entity';
import { ShopRepository } from '../../../domain/repository/shop.repository';
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
    softDelete: jest.fn().mockResolvedValue(undefined),
  } as unknown as jest.Mocked<Repository<Shop>>;
}

export function shopRepositoryDomainMock(): jest.Mocked<ShopRepository> {
  return {
    getAllShops: jest.fn().mockImplementation(async (): Promise<Shop[]> => {
      return [SHOPMOCK, SHOPMOCK, SHOPMOCK] as Shop[];
    }),
    createShop: jest.fn().mockImplementation(async (shopData: Shop): Promise<Shop> => {
      return {
        id: faker.datatype.number({ min: 1, max: 1000 }),
        name: shopData.name ? shopData.name : faker.company.name(),
        description: shopData.description ? shopData.description : faker.lorem.sentence(),
        latitude: (shopData.latitude ?? +faker.address.latitude()) as number,
        longitude: (shopData.longitude ?? +faker.address.longitude()) as number,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Shop;
    }),
    updateShop: jest.fn().mockImplementation(async (id: number, shopData: Shop): Promise<Shop> => {
      return {
        id: id,
        name: shopData.name ? shopData.name : faker.company.name(),
        description: shopData.description ? shopData.description : faker.lorem.sentence(),
        latitude: (shopData.latitude ?? +faker.address.latitude()) as number,
        longitude: (shopData.longitude ?? +faker.address.longitude()) as number,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Shop;
    }),
    deleteShop: jest.fn().mockResolvedValue(undefined),
  } as unknown as jest.Mocked<ShopRepository>;
}

export const SHOPMOCK: Shop = {
  id: faker.datatype.number({ min: 1, max: 1000 }),
  name: faker.company.name(),
  description: faker.lorem.sentence(),
  latitude: +faker.address.latitude() as number,
  longitude: +faker.address.longitude() as number,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};
