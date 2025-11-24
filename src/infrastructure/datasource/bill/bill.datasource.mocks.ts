/* eslint-disable @typescript-eslint/no-explicit-any */

// Re-export enums needed for mocks
export enum NetUnits {
  UNIT = 'unit',
  KILOGRAM = 'kg',
  GRAM = 'g',
  LITER = 'l',
  MILLILITER = 'ml',
  METER = 'm',
  CENTIMETER = 'cm',
}

// Common interfaces for mocks
interface MockBill {
  id?: number;
  idShop?: number;
  idCurrency?: number;
  idPaymentMethod?: number;
  idUser?: number;
  total?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

interface MockCreateBillDto {
  idShop: number;
  idCurrency: number;
  idPaymentMethod: number;
  idUser: number;
  total: number;
  billItems: MockBillItem[];
}

interface MockBillItem {
  id?: number;
  idBill?: number;
  idProduct?: number;
  quantity?: number;
  netPrice?: number;
  netUnit?: NetUnits;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

/**
 * Mock data for Bill entity tests
 */
export const CREATE_MOCK_BILL = (overrides: Partial<MockBill> = {}): MockBill => ({
  id: 1,
  idShop: 1,
  idCurrency: 1,
  idPaymentMethod: 1,
  idUser: 1,
  total: 150.75,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  deletedAt: null,
  ...overrides,
});

/**
 * Mock data for BillItem entity tests
 */
export const CREATE_MOCK_BILL_ITEM = (overrides: Partial<MockBillItem> = {}): MockBillItem => ({
  id: 1,
  idBill: 1,
  idProduct: 1,
  quantity: 2,
  netPrice: 10.5,
  netUnit: NetUnits.KILOGRAM,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  deletedAt: null,
  ...overrides,
});

/**
 * Mock TypeORM UpdateResult
 */
export const CREATE_MOCK_UPDATE_RESULT = (
  affected = 1,
): { affected: number; generatedMaps: any[]; raw: any } => ({
  affected,
  generatedMaps: [],
  raw: {},
});

/**
 * Creates a mock repository with common TypeORM repository methods
 */
export const CREATE_MOCK_REPOSITORY = (
  customMethods: Record<string, any> = {},
): Record<string, any> => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  findAndCount: jest.fn(),
  softDelete: jest.fn(),
  findOneOrFail: jest.fn(),
  createQueryBuilder: jest.fn(),
  preload: jest.fn(),
  merge: jest.fn(),
  upsert: jest.fn(),
  ...customMethods,
});

/**
 * Creates a mock QueryBuilder with chainable methods
 */
export const CREATE_MOCK_QUERY_BUILDER = (returnData: any[] = []): Record<string, any> => ({
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue(returnData),
  getOne: jest.fn().mockResolvedValue(returnData[0] || null),
  getRawMany: jest.fn().mockResolvedValue(returnData),
});

/**
 * Creates a mock EntityManager
 */
export const CREATE_MOCK_ENTITY_MANAGER = (
  billRepo: any,
  billItemRepo?: any,
): Record<string, any> => ({
  create: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
  findOne: jest.fn(),
  getRepository: jest.fn((entity) => {
    if (entity?.name === 'Bill') return billRepo;
    if (entity?.name === 'BillItem') return billItemRepo || billRepo;
    return billRepo;
  }),
});

/**
 * Creates a mock QueryRunner
 */
export const CREATE_MOCK_QUERY_RUNNER = (
  entityManager: Record<string, any>,
): Record<string, any> => ({
  manager: entityManager,
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  isReleased: false,
  isTransactionActive: true,
});

/**
 * Mock AppDataSource setup data
 */
export interface MockAppDataSourceSetup {
  billRepo: any;
  billItemRepo?: any;
  queryRunner?: any;
}

/**
 * Returns mock setup configuration for AppDataSource
 */
export const CREATE_APP_DATA_SOURCE_MOCK_SETUP = (
  setup: MockAppDataSourceSetup,
): Record<string, any> => ({
  getRepository: jest.fn((entity) => {
    if (entity?.name === 'Bill') return setup.billRepo;
    if (entity?.name === 'BillItem') return setup.billItemRepo || setup.billRepo;
    return setup.billRepo;
  }),
  createQueryRunner: setup.queryRunner ? jest.fn().mockReturnValue(setup.queryRunner) : jest.fn(),
});

/**
 * Common test data factory for CreateBillDto
 */
export const CREATE_MOCK_CREATE_BILL_DTO = (withItems = true): MockCreateBillDto => ({
  idShop: 1,
  idCurrency: 1,
  idPaymentMethod: 1,
  idUser: 1,
  total: 150.75,
  billItems: withItems
    ? [
        {
          idBill: 1,
          idProduct: 1,
          quantity: 2,
          netPrice: 10.5,
          netUnit: NetUnits.KILOGRAM,
        },
        {
          idBill: 1,
          idProduct: 2,
          quantity: 1,
          netPrice: 25.25,
          netUnit: NetUnits.UNIT,
        },
      ]
    : [],
});

/**
 * Common test data factory for UpdateBillDto
 */
export const CREATE_MOCK_UPDATE_BILL_DTO = (): Record<string, any> => ({
  total: 200.0,
  billItems: [
    {
      id: 1,
      idProduct: 1,
      quantity: 3,
      netPrice: 15.75,
      netUnit: NetUnits.KILOGRAM,
    },
  ],
});

/**
 * Common test data factory for search filters
 */
export const CREATE_MOCK_SEARCH_FILTER = (
  overrides: Record<string, any> = {},
): Record<string, any> => ({
  page: 1,
  pageSize: 10,
  filter: { idShop: 1 },
  ...overrides,
});

/**
 * Creates a mock BillRepository for testing
 */
export const CREATE_MOCK_BILL_REPOSITORY = (
  customMethods: Record<string, any> = {},
): Record<string, any> => ({
  create: jest.fn(),
  search: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  ...customMethods,
});
