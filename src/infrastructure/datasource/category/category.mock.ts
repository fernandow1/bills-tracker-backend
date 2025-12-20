/* eslint-disable @typescript-eslint/naming-convention */
import { faker } from '@faker-js/faker';
import { Repository, DeleteResult } from 'typeorm';
import { Category } from '../../../domain/entities/category.entity';
import { CreateCategoryDTO } from '../../../application/dtos/category/create-category.dto';
import { UpdateCategoryDTO } from '../../../application/dtos/category/update-category.dto';
import { CategoryDataSource } from '../../../domain/datasources/category.datasource';
import { CategoryRepository } from '../../../domain/repository/category.repository';

// Tipos específicos para mocks
export interface MockedCategoryRepository {
  create: jest.MockedFunction<(entity: CreateCategoryDTO) => Category>;
  save: jest.MockedFunction<(entity: Category) => Promise<Category>>;
  find: jest.MockedFunction<() => Promise<Category[]>>;
  findOneOrFail: jest.MockedFunction<(options: { where: { id: number } }) => Promise<Category>>;
  merge: jest.MockedFunction<(target: Category, source: Partial<Category>) => Category>;
  softDelete: jest.MockedFunction<(id: number) => Promise<DeleteResult>>;
}

export interface MockedCategoryDataSource extends CategoryDataSource {
  createCategory: jest.MockedFunction<(createCategoryDTO: CreateCategoryDTO) => Promise<Category>>;
  updateCategory: jest.MockedFunction<
    (id: number, updateCategoryDTO: Partial<CreateCategoryDTO>) => Promise<Category>
  >;
  getAllCategories: jest.MockedFunction<() => Promise<Category[]>>;
  deleteCategory: jest.MockedFunction<(id: number) => Promise<void>>;
  search: jest.MockedFunction<CategoryDataSource['search']>;
}

export interface MockedTypeOrmDataSource {
  getRepository: jest.MockedFunction<(entity: typeof Category) => Repository<Category>>;
}

export const CATEGORY_MOCK: Category = {
  id: 1,
  name: 'Electronics',
  description: 'Electronic devices and accessories',
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  deletedAt: null,
};

export const createCategoryMock = (overrides: Partial<Category> = {}): Category => ({
  id: faker.datatype.number({ min: 1, max: 1000 }),
  name: faker.commerce.department(),
  description: faker.lorem.sentence(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  deletedAt: null,
  ...overrides,
});

export const createCategoryDtoMock = (
  overrides: Partial<CreateCategoryDTO> = {},
): CreateCategoryDTO => ({
  name: faker.commerce.department(),
  description: faker.lorem.sentence(),
  ...overrides,
});

export const updateCategoryDtoMock = (
  overrides: Partial<UpdateCategoryDTO> = {},
): UpdateCategoryDTO => ({
  name: faker.commerce.department(),
  description: faker.lorem.sentence(),
  ...overrides,
});

// Repository mock con tipos específicos
export const createCategoryRepositoryDomainMock = (): jest.Mocked<CategoryDataSource> => ({
  createCategory: jest.fn<Promise<Category>, [CreateCategoryDTO]>(),
  updateCategory: jest.fn<Promise<Category>, [number, Partial<CreateCategoryDTO>]>(),
  getAllCategories: jest.fn<Promise<Category[]>, []>(),
  deleteCategory: jest.fn<Promise<void>, [number]>(),
  search: jest.fn(),
});

// DataSource mocks con tipos específicos
export const createCategoryDataSourceDomainMock = (): MockedCategoryDataSource => ({
  createCategory: jest.fn<Promise<Category>, [CreateCategoryDTO]>(),
  updateCategory: jest.fn<Promise<Category>, [number, Partial<CreateCategoryDTO>]>(),
  getAllCategories: jest.fn<Promise<Category[]>, []>(),
  deleteCategory: jest.fn<Promise<void>, [number]>(),
  search: jest.fn(),
});

export const createCategoryTypeOrmRepositoryMock = (): MockedCategoryRepository => ({
  create: jest.fn<Category, [CreateCategoryDTO]>(),
  save: jest.fn<Promise<Category>, [Category]>(),
  find: jest.fn<Promise<Category[]>, []>(),
  findOneOrFail: jest.fn<Promise<Category>, [{ where: { id: number } }]>(),
  merge: jest.fn<Category, [Category, Partial<Category>]>(),
  softDelete: jest.fn<Promise<DeleteResult>, [number]>(),
});

export const createTypeOrmDataSourceMock = (): MockedTypeOrmDataSource => ({
  getRepository: jest.fn<Repository<Category>, [typeof Category]>(),
});

// Mock específico para CategoryRepository (para casos de uso)
export const categoryRepositoryDomainMock = (): jest.Mocked<CategoryRepository> => ({
  createCategory: jest.fn<Promise<Category>, [CreateCategoryDTO]>(),
  updateCategory: jest.fn<Promise<Category>, [number, Partial<CreateCategoryDTO>]>(),
  getAllCategories: jest.fn<Promise<Category[]>, []>(),
  deleteCategory: jest.fn<Promise<void>, [number]>(),
  search: jest.fn(),
});

// Helper para crear mocks con valores por defecto
export const createMockedCategoryRepository = (
  overrides?: Partial<MockedCategoryRepository>,
): MockedCategoryRepository => {
  const mock = createCategoryTypeOrmRepositoryMock();
  return { ...mock, ...overrides };
};

export const createMockedCategoryDataSource = (
  overrides?: Partial<MockedCategoryDataSource>,
): MockedCategoryDataSource => {
  const mock = createCategoryDataSourceDomainMock();
  return { ...mock, ...overrides };
};
