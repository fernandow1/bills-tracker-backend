import { BillItemDatasourceImpl } from './bill-item.datasource.impl';
import { CreateBillItemDTO } from '../../../application/dtos/bill-item/create-bill-item.dto';
import { UpdateBillItemDTO } from '../../../application/dtos/bill-item/update-bill-item.dto';
import { BillItem } from '../../database/entities/bill-item.entity';
import { AppDataSource } from '../../database/connection';
import { QueryRunner, Repository, EntityManager } from 'typeorm';
import { NetUnits } from '../../../domain/value-objects/net-units.enum';

// Mock AppDataSource
jest.mock('../../database/connection', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('BillItemDatasourceImpl', () => {
  let billItemDatasource: BillItemDatasourceImpl;
  let mockRepository: jest.Mocked<Repository<BillItem>>;
  let mockQueryRunner: jest.Mocked<QueryRunner>;
  let mockEntityManager: jest.Mocked<EntityManager>;

  const mockBillItem: BillItem = {
    id: 1,
    idBill: 1,
    idProduct: 1,
    quantity: 2,
    netPrice: 10.5,
    netUnit: NetUnits.KILOGRAM,
    contentValue: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null,
    bill: {} as BillItem['bill'],
    product: {} as BillItem['product'],
  };

  const createBillItemDto: CreateBillItemDTO = {
    idBill: 1,
    idProduct: 1,
    quantity: 2,
    netPrice: 10.5,
    netUnit: NetUnits.KILOGRAM,
  };

  const updateBillItemDto: UpdateBillItemDTO = {
    id: 1,
    quantity: 3,
    netPrice: 15.75,
  };

  beforeEach(() => {
    billItemDatasource = new BillItemDatasourceImpl(AppDataSource);

    // Mock repository methods
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      preload: jest.fn(),
      softDelete: jest.fn(),
      find: jest.fn(),
    } as unknown as jest.Mocked<Repository<BillItem>>;

    // Mock EntityManager and its getRepository method
    mockEntityManager = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
    } as unknown as jest.Mocked<EntityManager>;

    // Mock QueryRunner
    mockQueryRunner = {
      manager: mockEntityManager,
    } as unknown as jest.Mocked<QueryRunner>;

    // Mock AppDataSource.getRepository
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('with transaction', () => {
      it('should create bill item using transaction manager', async () => {
        // Arrange
        mockRepository.create.mockReturnValue(mockBillItem);
        mockRepository.save.mockResolvedValue(mockBillItem);

        // Act
        const result = await billItemDatasource.create(createBillItemDto, mockQueryRunner);

        // Assert
        expect(mockEntityManager.getRepository).toHaveBeenCalledWith(BillItem);
        expect(mockRepository.create).toHaveBeenCalledWith(createBillItemDto);
        expect(mockRepository.save).toHaveBeenCalledWith(mockBillItem);
        expect(AppDataSource.getRepository).not.toHaveBeenCalled();
        expect(result).toEqual(mockBillItem);
      });

      it('should handle transaction errors properly', async () => {
        // Arrange
        const error = new Error('Transaction failed');
        mockRepository.create.mockReturnValue(mockBillItem);
        mockRepository.save.mockRejectedValue(error);

        // Act & Assert
        await expect(billItemDatasource.create(createBillItemDto, mockQueryRunner)).rejects.toThrow(
          'Transaction failed',
        );

        expect(mockEntityManager.getRepository).toHaveBeenCalledWith(BillItem);
        expect(mockRepository.create).toHaveBeenCalledWith(createBillItemDto);
        expect(mockRepository.save).toHaveBeenCalledWith(mockBillItem);
      });
    });

    describe('without transaction', () => {
      it('should create bill item using AppDataSource', async () => {
        // Arrange
        mockRepository.create.mockReturnValue(mockBillItem);
        mockRepository.save.mockResolvedValue(mockBillItem);

        // Act
        const result = await billItemDatasource.create(createBillItemDto);

        // Assert
        expect(AppDataSource.getRepository).toHaveBeenCalledWith(BillItem);
        expect(mockRepository.create).toHaveBeenCalledWith(createBillItemDto);
        expect(mockRepository.save).toHaveBeenCalledWith(mockBillItem);
        expect(mockEntityManager.getRepository).not.toHaveBeenCalled();
        expect(result).toEqual(mockBillItem);
      });

      it('should handle AppDataSource errors properly', async () => {
        // Arrange
        const error = new Error('Database connection failed');
        mockRepository.create.mockReturnValue(mockBillItem);
        mockRepository.save.mockRejectedValue(error);

        // Act & Assert
        await expect(billItemDatasource.create(createBillItemDto)).rejects.toThrow(
          'Database connection failed',
        );

        expect(AppDataSource.getRepository).toHaveBeenCalledWith(BillItem);
        expect(mockRepository.create).toHaveBeenCalledWith(createBillItemDto);
        expect(mockRepository.save).toHaveBeenCalledWith(mockBillItem);
      });
    });
  });

  describe('update', () => {
    describe('with transaction', () => {
      it('should update bill item using transaction manager', async () => {
        // Arrange
        const updatedBillItem = { ...mockBillItem, ...updateBillItemDto };
        mockRepository.preload.mockResolvedValue(updatedBillItem);
        mockRepository.save.mockResolvedValue(updatedBillItem);

        // Act
        const result = await billItemDatasource.update(1, updateBillItemDto, mockQueryRunner);

        // Assert
        expect(mockEntityManager.getRepository).toHaveBeenCalledWith(BillItem);
        expect(mockRepository.preload).toHaveBeenCalledWith(updateBillItemDto);
        expect(mockRepository.save).toHaveBeenCalledWith(updatedBillItem);
        expect(AppDataSource.getRepository).not.toHaveBeenCalled();
        expect(result).toEqual(updatedBillItem);
      });

      it('should throw error when bill item not found in transaction', async () => {
        // Arrange
        mockRepository.preload.mockResolvedValue(undefined);

        // Act & Assert
        await expect(
          billItemDatasource.update(999, updateBillItemDto, mockQueryRunner),
        ).rejects.toThrow('BillItem not found');

        expect(mockEntityManager.getRepository).toHaveBeenCalledWith(BillItem);
        expect(mockRepository.preload).toHaveBeenCalledWith(updateBillItemDto);
        expect(mockRepository.save).not.toHaveBeenCalled();
      });
    });

    describe('without transaction', () => {
      it('should update bill item using AppDataSource', async () => {
        // Arrange
        const updatedBillItem = { ...mockBillItem, ...updateBillItemDto };
        mockRepository.preload.mockResolvedValue(updatedBillItem);
        mockRepository.save.mockResolvedValue(updatedBillItem);

        // Act
        const result = await billItemDatasource.update(1, updateBillItemDto);

        // Assert
        expect(AppDataSource.getRepository).toHaveBeenCalledWith(BillItem);
        expect(mockRepository.preload).toHaveBeenCalledWith(updateBillItemDto);
        expect(mockRepository.save).toHaveBeenCalledWith(updatedBillItem);
        expect(mockEntityManager.getRepository).not.toHaveBeenCalled();
        expect(result).toEqual(updatedBillItem);
      });

      it('should throw error when bill item not found', async () => {
        // Arrange
        mockRepository.preload.mockResolvedValue(undefined);

        // Act & Assert
        await expect(billItemDatasource.update(999, updateBillItemDto)).rejects.toThrow(
          'BillItem not found',
        );

        expect(AppDataSource.getRepository).toHaveBeenCalledWith(BillItem);
        expect(mockRepository.preload).toHaveBeenCalledWith(updateBillItemDto);
        expect(mockRepository.save).not.toHaveBeenCalled();
      });
    });
  });

  describe('delete', () => {
    describe('with transaction', () => {
      it('should soft delete bill item using transaction manager', async () => {
        // Arrange
        mockRepository.softDelete.mockResolvedValue({ affected: 1, generatedMaps: [], raw: {} });

        // Act
        await billItemDatasource.delete(1, mockQueryRunner);

        // Assert
        expect(mockEntityManager.getRepository).toHaveBeenCalledWith(BillItem);
        expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
        expect(AppDataSource.getRepository).not.toHaveBeenCalled();
      });

      it('should handle transaction delete errors', async () => {
        // Arrange
        const error = new Error('Delete transaction failed');
        mockRepository.softDelete.mockRejectedValue(error);

        // Act & Assert
        await expect(billItemDatasource.delete(1, mockQueryRunner)).rejects.toThrow(
          'Delete transaction failed',
        );

        expect(mockEntityManager.getRepository).toHaveBeenCalledWith(BillItem);
        expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
      });
    });

    describe('without transaction', () => {
      it('should soft delete bill item using AppDataSource', async () => {
        // Arrange
        mockRepository.softDelete.mockResolvedValue({ affected: 1, generatedMaps: [], raw: {} });

        // Act
        await billItemDatasource.delete(1);

        // Assert
        expect(AppDataSource.getRepository).toHaveBeenCalledWith(BillItem);
        expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
        expect(mockEntityManager.getRepository).not.toHaveBeenCalled();
      });

      it('should handle AppDataSource delete errors', async () => {
        // Arrange
        const error = new Error('Delete operation failed');
        mockRepository.softDelete.mockRejectedValue(error);

        // Act & Assert
        await expect(billItemDatasource.delete(1)).rejects.toThrow('Delete operation failed');

        expect(AppDataSource.getRepository).toHaveBeenCalledWith(BillItem);
        expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('findAll', () => {
    const mockBillItems: BillItem[] = [mockBillItem, { ...mockBillItem, id: 2, idProduct: 2 }];

    describe('with transaction', () => {
      it('should find all bill items using transaction manager', async () => {
        // Arrange
        mockRepository.find.mockResolvedValue(mockBillItems);

        // Act
        const result = await billItemDatasource.findAll(mockQueryRunner);

        // Assert
        expect(mockEntityManager.getRepository).toHaveBeenCalledWith(BillItem);
        expect(mockRepository.find).toHaveBeenCalled();
        expect(AppDataSource.getRepository).not.toHaveBeenCalled();
        expect(result).toEqual(mockBillItems);
      });

      it('should return empty array when no items found in transaction', async () => {
        // Arrange
        mockRepository.find.mockResolvedValue([]);

        // Act
        const result = await billItemDatasource.findAll(mockQueryRunner);

        // Assert
        expect(mockEntityManager.getRepository).toHaveBeenCalledWith(BillItem);
        expect(mockRepository.find).toHaveBeenCalled();
        expect(result).toEqual([]);
      });
    });

    describe('without transaction', () => {
      it('should find all bill items using AppDataSource', async () => {
        // Arrange
        mockRepository.find.mockResolvedValue(mockBillItems);

        // Act
        const result = await billItemDatasource.findAll();

        // Assert
        expect(AppDataSource.getRepository).toHaveBeenCalledWith(BillItem);
        expect(mockRepository.find).toHaveBeenCalled();
        expect(mockEntityManager.getRepository).not.toHaveBeenCalled();
        expect(result).toEqual(mockBillItems);
      });

      it('should return empty array when no items found', async () => {
        // Arrange
        mockRepository.find.mockResolvedValue([]);

        // Act
        const result = await billItemDatasource.findAll();

        // Assert
        expect(AppDataSource.getRepository).toHaveBeenCalledWith(BillItem);
        expect(mockRepository.find).toHaveBeenCalled();
        expect(result).toEqual([]);
      });

      it('should handle database connection errors', async () => {
        // Arrange
        const error = new Error('Database connection lost');
        mockRepository.find.mockRejectedValue(error);

        // Act & Assert
        await expect(billItemDatasource.findAll()).rejects.toThrow('Database connection lost');

        expect(AppDataSource.getRepository).toHaveBeenCalledWith(BillItem);
        expect(mockRepository.find).toHaveBeenCalled();
      });
    });
  });

  describe('Repository Selection Logic', () => {
    it('should consistently use transaction manager when QueryRunner is provided', async () => {
      // Test all methods use transaction manager consistently
      mockRepository.create.mockReturnValue(mockBillItem);
      mockRepository.save.mockResolvedValue(mockBillItem);
      mockRepository.preload.mockResolvedValue(mockBillItem);
      mockRepository.softDelete.mockResolvedValue({ affected: 1, generatedMaps: [], raw: {} });
      mockRepository.find.mockResolvedValue([mockBillItem]);

      // Act - call all methods with transaction
      await billItemDatasource.create(createBillItemDto, mockQueryRunner);
      await billItemDatasource.update(1, updateBillItemDto, mockQueryRunner);
      await billItemDatasource.delete(1, mockQueryRunner);
      await billItemDatasource.findAll(mockQueryRunner);

      // Assert - transaction manager should be used 4 times (once per method)
      expect(mockEntityManager.getRepository).toHaveBeenCalledTimes(4);
      expect(AppDataSource.getRepository).not.toHaveBeenCalled();
    });

    it('should consistently use AppDataSource when no QueryRunner is provided', async () => {
      // Setup
      mockRepository.create.mockReturnValue(mockBillItem);
      mockRepository.save.mockResolvedValue(mockBillItem);
      mockRepository.preload.mockResolvedValue(mockBillItem);
      mockRepository.softDelete.mockResolvedValue({ affected: 1, generatedMaps: [], raw: {} });
      mockRepository.find.mockResolvedValue([mockBillItem]);

      // Act - call all methods without transaction
      await billItemDatasource.create(createBillItemDto);
      await billItemDatasource.update(1, updateBillItemDto);
      await billItemDatasource.delete(1);
      await billItemDatasource.findAll();

      // Assert - AppDataSource should be used 4 times (once per method)
      expect(AppDataSource.getRepository).toHaveBeenCalledTimes(4);
      expect(mockEntityManager.getRepository).not.toHaveBeenCalled();
    });
  });

  describe('findCheapestShopsByProduct', () => {
    const mockQueryResults = [
      {
        shop_id: 1,
        shop_name: 'Shop A',
        latitude: -34.5875,
        longitude: -58.4173,
        last_price: '100.50',
        last_purchase_date: '2026-01-20T10:00:00.000Z',
        currency: 'ARS',
      },
      {
        shop_id: 2,
        shop_name: 'Shop B',
        latitude: -34.621,
        longitude: -58.371,
        last_price: '120.75',
        last_purchase_date: '2026-01-18T15:30:00.000Z',
        currency: 'ARS',
      },
    ];

    let mockDataSource: any;

    beforeEach(() => {
      mockDataSource = {
        query: jest.fn(),
      };
      billItemDatasource = new BillItemDatasourceImpl(mockDataSource);
    });

    it('should execute query and return mapped results without options', async () => {
      // Arrange
      mockDataSource.query.mockResolvedValue(mockQueryResults);

      // Act
      const result = await billItemDatasource.findCheapestShopsByProduct(123);

      // Assert
      expect(mockDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [123, 10], // productId and default limit
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        shopId: 1,
        shopName: 'Shop A',
        latitude: -34.5875,
        longitude: -58.4173,
        lastPrice: 100.5,
        lastPurchaseDate: new Date('2026-01-20T10:00:00.000Z'),
        currency: 'ARS',
      });
    });

    it('should include maxAgeDays filter when provided', async () => {
      // Arrange
      mockDataSource.query.mockResolvedValue(mockQueryResults);

      // Act
      await billItemDatasource.findCheapestShopsByProduct(123, { maxAgeDays: 30 });

      // Assert
      expect(mockDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('DATE_SUB(NOW(), INTERVAL ? DAY)'),
        [123, 30, 10], // productId, maxAgeDays, default limit
      );
    });

    it('should use custom limit when provided', async () => {
      // Arrange
      mockDataSource.query.mockResolvedValue(mockQueryResults);

      // Act
      await billItemDatasource.findCheapestShopsByProduct(123, { limit: 5 });

      // Assert
      expect(mockDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT ?'),
        [123, 5], // productId and custom limit
      );
    });

    it('should handle both maxAgeDays and limit options', async () => {
      // Arrange
      mockDataSource.query.mockResolvedValue(mockQueryResults);

      // Act
      await billItemDatasource.findCheapestShopsByProduct(123, {
        maxAgeDays: 7,
        limit: 3,
      });

      // Assert
      expect(mockDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('DATE_SUB'),
        [123, 7, 3], // productId, maxAgeDays, limit
      );
    });

    it('should return empty array when no results found', async () => {
      // Arrange
      mockDataSource.query.mockResolvedValue([]);

      // Act
      const result = await billItemDatasource.findCheapestShopsByProduct(999);

      // Assert
      expect(result).toEqual([]);
      expect(mockDataSource.query).toHaveBeenCalled();
    });

    it('should handle null coordinates in results', async () => {
      // Arrange
      const resultsWithNullCoords = [
        {
          shop_id: 3,
          shop_name: 'Shop C',
          latitude: null,
          longitude: null,
          last_price: '95.00',
          last_purchase_date: '2026-01-22T08:00:00.000Z',
          currency: 'USD',
        },
      ];
      mockDataSource.query.mockResolvedValue(resultsWithNullCoords);

      // Act
      const result = await billItemDatasource.findCheapestShopsByProduct(123);

      // Assert
      expect(result[0].latitude).toBeNull();
      expect(result[0].longitude).toBeNull();
    });

    it('should correctly parse numeric price from string', async () => {
      // Arrange
      const resultWithDecimal = [
        {
          shop_id: 1,
          shop_name: 'Shop A',
          latitude: -34.5875,
          longitude: -58.4173,
          last_price: '1234.56',
          last_purchase_date: '2026-01-20T10:00:00.000Z',
          currency: 'ARS',
        },
      ];
      mockDataSource.query.mockResolvedValue(resultWithDecimal);

      // Act
      const result = await billItemDatasource.findCheapestShopsByProduct(123);

      // Assert
      expect(result[0].lastPrice).toBe(1234.56);
      expect(typeof result[0].lastPrice).toBe('number');
    });

    it('should propagate database errors', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      mockDataSource.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(billItemDatasource.findCheapestShopsByProduct(123)).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should build query with correct SQL structure', async () => {
      // Arrange
      mockDataSource.query.mockResolvedValue([]);

      // Act
      await billItemDatasource.findCheapestShopsByProduct(123, { maxAgeDays: 30 });

      // Assert
      const queryCall = mockDataSource.query.mock.calls[0][0];
      expect(queryCall).toContain('FROM bill_item bi');
      expect(queryCall).toContain('INNER JOIN bill b ON bi.id_bill = b.id');
      expect(queryCall).toContain('INNER JOIN shop s ON b.id_shop = s.id');
      expect(queryCall).toContain('INNER JOIN currency c ON b.id_currency = c.id');
      expect(queryCall).toContain('WHERE bi.id_product = ?');
      expect(queryCall).toContain('AND bi.deleted_at IS NULL');
      expect(queryCall).toContain('AND b.deleted_at IS NULL');
      expect(queryCall).toContain('ORDER BY bi.net_price ASC, b.purchased_at DESC');
    });
  });
});
