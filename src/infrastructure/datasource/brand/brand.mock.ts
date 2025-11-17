import { faker } from '@faker-js/faker';
import { Brand } from '../../../domain/entities/brand.entity';
import { BrandRepository } from '../../../domain/repository/brand.repository';
import { CreateBrandDTO } from '../../../application/dtos/brand/create-brand.dto';
import { UpdateBrandDTO } from '../../../application/dtos/brand/update-brand.dto';

export const BRAND_MOCK: Brand = {
  id: 1,
  name: 'Nike',
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  deletedAt: null,
};

export const createBrandMock = (overrides: Partial<Brand> = {}): Brand => ({
  id: faker.datatype.number({ min: 1, max: 1000 }),
  name: faker.company.name(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  deletedAt: null,
  ...overrides,
});

export const createBrandDTOMock = (overrides: Partial<CreateBrandDTO> = {}): CreateBrandDTO => ({
  name: faker.company.name(),
  ...overrides,
});

export const updateBrandDTOMock = (overrides: Partial<UpdateBrandDTO> = {}): UpdateBrandDTO => ({
  name: faker.company.name(),
  ...overrides,
});

export const brandRepositoryDomainMock = (): jest.Mocked<BrandRepository> => ({
  create: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
  delete: jest.fn(),
});

// DataSource mocks
import { BrandDatasource } from '../../../domain/datasources/brand.datasource';
import { DataSource, Repository } from 'typeorm';

export const brandDataSourceDomainMock = (): jest.Mocked<BrandDatasource> => ({
  create: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
  delete: jest.fn(),
});

export const brandTypeOrmRepositoryMock = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneOrFail: jest.fn(),
  merge: jest.fn(),
  softDelete: jest.fn(),
});

export const typeOrmDataSourceMock = () => ({
  getRepository: jest.fn(),
});
