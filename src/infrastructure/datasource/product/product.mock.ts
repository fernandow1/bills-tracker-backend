/* eslint-disable @typescript-eslint/naming-convention */
import { faker } from '@faker-js/faker';
import { Repository, DeleteResult, QueryRunner } from 'typeorm';
import { Product } from '../../../domain/entities/product.entity';
import { CreateProductDTO } from '../../../application/dtos/product/create-product.dto';
import { UpdateProductDTO } from '../../../application/dtos/product/update-product.dto';
import { ProductDataSource } from '../../../domain/datasources/product.datasource';
import { ProductRepository } from '../../../domain/repository/product.repository';
import { BrandCategory } from '../../database/entities/brand-category.entity';
import { Brand } from '../../database/entities/brand.entity';
import { Category } from '../../database/entities/category.entity';
import { IQueryFilter } from '../../../application/models/query-filter.model';
import { Pagination } from '../../../application/models/pagination.model';

// Tipos específicos para mocks
export interface MockedProductRepository {
  create: jest.MockedFunction<(entity: CreateProductDTO) => Product>;
  save: jest.MockedFunction<(entity: Product) => Promise<Product>>;
  find: jest.MockedFunction<() => Promise<Product[]>>;
  findOneByOrFail: jest.MockedFunction<(options: { id: number }) => Promise<Product>>;
  findOneOrFail: jest.MockedFunction<(options: { where: { id: number } }) => Promise<Product>>;
  merge: jest.MockedFunction<(target: Product, source: Partial<Product>) => Product>;
  softDelete: jest.MockedFunction<(id: number) => Promise<DeleteResult>>;
}

export interface MockedBrandCategoryRepository {
  upsert: jest.MockedFunction<
    (
      entity: { idBrand: number; idCategory: number },
      conflictPaths: string[],
    ) => Promise<BrandCategory>
  >;
}

export interface MockedQueryRunnerManager {
  create: jest.MockedFunction<(entity: typeof Product, data: CreateProductDTO) => Product>;
  save: jest.MockedFunction<(entity: Product) => Promise<Product>>;
  findOneOrFail: jest.MockedFunction<
    (entity: typeof Product, options: { where: { id: number } }) => Promise<Product>
  >;
  merge: jest.MockedFunction<
    (entity: typeof Product, target: Product, source: UpdateProductDTO) => Product
  >;
  upsert: jest.MockedFunction<
    (
      entity: typeof BrandCategory,
      data: { idBrand: number; idCategory: number },
      conflictPaths: string[],
    ) => Promise<BrandCategory>
  >;
}

export interface MockedQueryRunner {
  connect: jest.MockedFunction<() => Promise<void>>;
  startTransaction: jest.MockedFunction<() => Promise<void>>;
  commitTransaction: jest.MockedFunction<() => Promise<void>>;
  rollbackTransaction: jest.MockedFunction<() => Promise<void>>;
  release: jest.MockedFunction<() => Promise<void>>;
  manager: MockedQueryRunnerManager;
}

export interface MockedProductDataSource extends ProductDataSource {
  search: jest.MockedFunction<(filter: IQueryFilter) => Promise<Pagination<Product>>>;
  createProduct: jest.MockedFunction<(createProductDTO: CreateProductDTO) => Promise<Product>>;
  updateProduct: jest.MockedFunction<
    (id: number, updateProductDTO: UpdateProductDTO) => Promise<UpdateProductDTO>
  >;
  getAllProducts: jest.MockedFunction<() => Promise<Product[]>>;
  getProductById: jest.MockedFunction<(id: number) => Promise<Product>>;
  deleteProduct: jest.MockedFunction<(id: number) => Promise<void>>;
}

export interface MockedProductRepositoryInterface extends ProductRepository {
  search: jest.MockedFunction<(filter: IQueryFilter) => Promise<Pagination<Product>>>;
  createProduct: jest.MockedFunction<(createProductDTO: CreateProductDTO) => Promise<Product>>;
  updateProduct: jest.MockedFunction<
    (id: number, updateProductDTO: UpdateProductDTO) => Promise<UpdateProductDTO>
  >;
  getAllProducts: jest.MockedFunction<() => Promise<Product[]>>;
  getProductById: jest.MockedFunction<(id: number) => Promise<Product>>;
  deleteProduct: jest.MockedFunction<(id: number) => Promise<void>>;
}

export interface MockedTypeOrmDataSource {
  getRepository: jest.MockedFunction<(entity: typeof Product) => Repository<Product>>;
  createQueryRunner: jest.MockedFunction<() => QueryRunner>;
}

export const PRODUCT_MOCK: Product = {
  id: 1,
  idBrand: 1,
  idCategory: 1,
  name: 'iPhone 15 Pro',
  description: 'Latest iPhone with advanced features',
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  deletedAt: null,
};

export const createProductMock = (overrides: Partial<Product> = {}): Product => ({
  id: faker.datatype.number({ min: 1, max: 1000 }),
  idBrand: faker.datatype.number({ min: 1, max: 100 }),
  idCategory: faker.datatype.number({ min: 1, max: 100 }),
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  deletedAt: null,
  ...overrides,
});

export const createProductDTOMock = (
  overrides: Partial<CreateProductDTO> = {},
): CreateProductDTO => ({
  idBrand: faker.datatype.number({ min: 1, max: 100 }),
  idCategory: faker.datatype.number({ min: 1, max: 100 }),
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  ...overrides,
});

export const updateProductDTOMock = (
  overrides: Partial<UpdateProductDTO> = {},
): UpdateProductDTO => ({
  idBrand: faker.datatype.number({ min: 1, max: 100 }),
  idCategory: faker.datatype.number({ min: 1, max: 100 }),
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  ...overrides,
});

const mockBrand: Brand = {
  id: 1,
  name: 'Mock Brand',
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  deletedAt: null,
  categories: [],
  products: [],
};

const mockCategory: Category = {
  id: 1,
  name: 'Mock Category',
  description: 'Mock Category Description',
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  deletedAt: null,
  brandCategories: [],
  products: [],
};

export const BRAND_CATEGORY_MOCK: BrandCategory = {
  idBrand: 1,
  idCategory: 1,
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  deletedAt: null,
  brand: mockBrand,
  category: mockCategory,
};

export const createBrandCategoryMock = (overrides: Partial<BrandCategory> = {}): BrandCategory => ({
  idBrand: faker.datatype.number({ min: 1, max: 100 }),
  idCategory: faker.datatype.number({ min: 1, max: 100 }),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  deletedAt: null,
  brand: mockBrand,
  category: mockCategory,
  ...overrides,
});

// Factory para crear mocks de QueryRunner completos
export const createMockedQueryRunner = (): MockedQueryRunner => ({
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: {
    create: jest.fn(),
    save: jest.fn(),
    findOneOrFail: jest.fn(),
    merge: jest.fn(),
    upsert: jest.fn(),
  },
});

// Factory para crear mocks de Repository completos
export const createMockedProductRepository = (): MockedProductRepository => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneByOrFail: jest.fn(),
  findOneOrFail: jest.fn(),
  merge: jest.fn(),
  softDelete: jest.fn(),
});

// Factory para crear mock del ProductRepository (domain)
export const createMockedProductRepositoryInterface = (): MockedProductRepositoryInterface => ({
  search: jest.fn(),
  createProduct: jest.fn(),
  getProductById: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
  getAllProducts: jest.fn(),
});

// Factory para crear mock del ProductDataSource
export const createMockedProductDataSource = (): MockedProductDataSource => ({
  search: jest.fn(),
  createProduct: jest.fn(),
  getProductById: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
  getAllProducts: jest.fn(),
});
