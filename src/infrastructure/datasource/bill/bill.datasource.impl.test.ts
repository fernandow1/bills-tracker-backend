/* eslint-disable @typescript-eslint/no-explicit-any */
import { BillDataSourceImpl } from './bill.datasource.impl';
import {
  CREATE_MOCK_BILL,
  CREATE_MOCK_CREATE_BILL_DTO,
  CREATE_MOCK_QUERY_RUNNER,
  CREATE_MOCK_ENTITY_MANAGER,
} from './bill.datasource.mocks';

// Mock AppDataSource
jest.mock('../../database/connection', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  AppDataSource: {
    getRepository: jest.fn(),
    createQueryRunner: jest.fn(),
  },
}));

describe('BillDataSourceImpl', () => {
  let billDataSource: BillDataSourceImpl;
  let mockBillRepository: Record<string, unknown>;
  let mockEntityManager: Record<string, unknown>;
  let mockQueryRunner: Record<string, unknown>;

  const mockBill = CREATE_MOCK_BILL();
  const createBillDto = CREATE_MOCK_CREATE_BILL_DTO();

  beforeEach(() => {
    billDataSource = new BillDataSourceImpl();

    // Mock repositories
    mockBillRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      findAndCount: jest.fn(),
      softDelete: jest.fn(),
      findOneOrFail: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    // Mock EntityManager using factory
    mockEntityManager = CREATE_MOCK_ENTITY_MANAGER(mockBillRepository);

    // Mock QueryRunner using factory
    mockQueryRunner = CREATE_MOCK_QUERY_RUNNER(mockEntityManager);

    // Setup AppDataSource mocks
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { AppDataSource: appDataSource } = require('../../database/connection');
    (appDataSource.getRepository as jest.Mock).mockReturnValue(mockBillRepository);
    (appDataSource.createQueryRunner as jest.Mock).mockReturnValue(mockQueryRunner);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('with transaction', () => {
      it('should create bill using provided transaction', async () => {
        // Arrange
        (mockEntityManager.create as jest.Mock).mockReturnValue(mockBill);
        (mockBillRepository.save as jest.Mock).mockResolvedValue(mockBill);

        const result = await billDataSource.create(createBillDto as any, mockQueryRunner as any);

        // Assert
        expect(mockEntityManager.create).toHaveBeenCalledWith(expect.any(Function), {
          idShop: createBillDto.idShop,
          idCurrency: createBillDto.idCurrency,
          idPaymentMethod: createBillDto.idPaymentMethod,
          idUser: createBillDto.idUser,
          total: createBillDto.total,
        });
        expect(mockBillRepository.save).toHaveBeenCalledWith(mockBill);
        expect(result).toEqual(mockBill);
      });
    });

    describe('without transaction', () => {
      it('should create bill without transaction', async () => {
        // Arrange
        (mockEntityManager.create as jest.Mock).mockReturnValue(mockBill);
        (mockBillRepository.save as jest.Mock).mockResolvedValue(mockBill);

        const result = await billDataSource.create(createBillDto as any);

        // Assert
        expect(mockQueryRunner.connect).toHaveBeenCalled();
        expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
        expect(mockEntityManager.create).toHaveBeenCalledWith(expect.any(Function), {
          idShop: createBillDto.idShop,
          idCurrency: createBillDto.idCurrency,
          idPaymentMethod: createBillDto.idPaymentMethod,
          idUser: createBillDto.idUser,
          total: createBillDto.total,
        });
        expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
        expect(mockQueryRunner.release).toHaveBeenCalled();
        expect(result).toEqual(mockBill);
      });
    });
  });

  describe('findById', () => {
    it('should find bill by id', async () => {
      (mockBillRepository.findOne as jest.Mock).mockResolvedValue(mockBill);

      const result = await billDataSource.findById(1);

      expect(mockBillRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockBill);
    });
  });

  describe('findAll', () => {
    it('should find all bills', async () => {
      const bills = [mockBill, { ...mockBill, id: 2 }];
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(bills),
      };
      (mockBillRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      const result = await billDataSource.findAll();

      expect(mockBillRepository.createQueryBuilder).toHaveBeenCalledWith('bill');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'bill.billItems',
        'billItems',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'billItems.product',
        'product',
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('bill.createdAt', 'DESC');
      expect(result).toEqual(bills);
    });
  });

  describe('search', () => {
    it('should search bills with filter', async () => {
      const bills = [mockBill];
      const total = 1;
      const filter = { page: 1, pageSize: 10, filter: { idShop: 1 } };
      (mockBillRepository.findAndCount as jest.Mock).mockResolvedValue([bills, total]);

      const result = await billDataSource.search(filter as any);

      expect(mockBillRepository.findAndCount).toHaveBeenCalledWith({
        where: filter.filter,
        relations: {
          billItems: { product: { category: true, brand: true } },
        },
        select: {
          id: true,
          idCurrency: true,
          idShop: true,
          total: true,
          billItems: {
            id: true,
            idBill: true,
            idProduct: true,
            quantity: true,
            netPrice: true,
            netUnit: true,
            product: {
              id: true,
              name: true,
              idBrand: true,
              idCategory: true,
              category: {
                id: true,
                name: true,
              },
              brand: { id: true, name: true },
            },
          },
        },
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({ data: bills, count: total });
    });
  });

  describe('delete', () => {
    it('should delete bill using transaction', async () => {
      (mockBillRepository.softDelete as jest.Mock).mockResolvedValue({ affected: 1 });

      await billDataSource.delete(1, mockQueryRunner as any);

      expect(mockBillRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should delete bill without transaction', async () => {
      (mockBillRepository.softDelete as jest.Mock).mockResolvedValue({ affected: 1 });

      await billDataSource.delete(1);

      expect(mockBillRepository.softDelete).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    const updateBillDto = { total: 200.0 };

    it('should update bill with transaction', async () => {
      const updatedBill = { ...mockBill, ...updateBillDto };
      (mockEntityManager.findOne as jest.Mock).mockResolvedValue(mockBill);
      (mockEntityManager.merge as jest.Mock).mockReturnValue(updatedBill);
      (mockEntityManager.save as jest.Mock).mockResolvedValue(updatedBill);

      const result = await billDataSource.update(1, updateBillDto as any, mockQueryRunner as any);

      expect(mockEntityManager.findOne).toHaveBeenCalledWith(expect.any(Function), {
        where: { id: 1 },
      });
      expect(mockEntityManager.merge).toHaveBeenCalledWith(
        expect.any(Function),
        mockBill,
        updateBillDto,
      );
      expect(mockEntityManager.save).toHaveBeenCalledWith(updatedBill);
      expect(result).toEqual(updatedBill);
    });

    it('should update bill without transaction', async () => {
      const updatedBill = { ...mockBill, ...updateBillDto };
      (mockEntityManager.findOne as jest.Mock).mockResolvedValue(mockBill);
      (mockEntityManager.merge as jest.Mock).mockReturnValue(updatedBill);
      (mockEntityManager.save as jest.Mock).mockResolvedValue(updatedBill);

      const result = await billDataSource.update(1, updateBillDto as any);

      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockEntityManager.findOne).toHaveBeenCalledWith(expect.any(Function), {
        where: { id: 1 },
      });
      expect(mockEntityManager.merge).toHaveBeenCalledWith(
        expect.any(Function),
        mockBill,
        updateBillDto,
      );
      expect(mockEntityManager.save).toHaveBeenCalledWith(updatedBill);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(result).toEqual(updatedBill);
    });
  });
});
