import { BillItemRepositoryImpl } from './bill-item.repository.impl';
import { CreateBillItemDTO } from '../../../application/dtos/bill-item/create-bill-item.dto';
import { UpdateBillItemDTO } from '../../../application/dtos/bill-item/update-bill-item.dto';
import { BillItemDataSource } from '../../../domain/datasources/bill-item.datasource';
import { BillItem } from '../../../domain/entities/bill-item.entity';
import { QueryRunner } from 'typeorm';
import { NetUnits } from '../../../domain/value-objects/net-units.enum';

describe('BillItemRepositoryImpl', () => {
  let billItemRepository: BillItemRepositoryImpl;
  let mockBillItemDataSource: jest.Mocked<BillItemDataSource>;
  let mockQueryRunner: QueryRunner;
  let mockConstructorQueryRunner: QueryRunner;

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
    // Mock BillItemDataSource
    mockBillItemDataSource = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findCheapestShopsByProduct: jest.fn(),
    } as unknown as jest.Mocked<BillItemDataSource>;

    // Mock QueryRunners
    mockQueryRunner = {} as QueryRunner;
    mockConstructorQueryRunner = {} as QueryRunner;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create repository without QueryRunner', () => {
      // Act
      billItemRepository = new BillItemRepositoryImpl(mockBillItemDataSource);

      // Assert
      expect(billItemRepository).toBeDefined();
      expect(billItemRepository).toBeInstanceOf(BillItemRepositoryImpl);
    });

    it('should create repository with QueryRunner', () => {
      // Act
      billItemRepository = new BillItemRepositoryImpl(
        mockBillItemDataSource,
        mockConstructorQueryRunner,
      );

      // Assert
      expect(billItemRepository).toBeDefined();
      expect(billItemRepository).toBeInstanceOf(BillItemRepositoryImpl);
    });
  });

  describe('create', () => {
    beforeEach(() => {
      billItemRepository = new BillItemRepositoryImpl(
        mockBillItemDataSource,
        mockConstructorQueryRunner,
      );
    });

    it('should delegate create to datasource with parameter transaction', async () => {
      // Arrange
      mockBillItemDataSource.create.mockResolvedValue(mockBillItem);

      // Act
      const result = await billItemRepository.create(createBillItemDto, mockQueryRunner);

      // Assert
      expect(mockBillItemDataSource.create).toHaveBeenCalledWith(
        createBillItemDto,
        mockQueryRunner,
      );
      expect(result).toEqual(mockBillItem);
    });

    it('should delegate create to datasource with constructor QueryRunner when no parameter provided', async () => {
      // Arrange
      mockBillItemDataSource.create.mockResolvedValue(mockBillItem);

      // Act
      const result = await billItemRepository.create(createBillItemDto);

      // Assert
      expect(mockBillItemDataSource.create).toHaveBeenCalledWith(
        createBillItemDto,
        mockConstructorQueryRunner,
      );
      expect(result).toEqual(mockBillItem);
    });

    it('should delegate create to datasource with undefined when no QueryRunner available', async () => {
      // Arrange
      billItemRepository = new BillItemRepositoryImpl(mockBillItemDataSource); // No constructor QueryRunner
      mockBillItemDataSource.create.mockResolvedValue(mockBillItem);

      // Act
      const result = await billItemRepository.create(createBillItemDto);

      // Assert
      expect(mockBillItemDataSource.create).toHaveBeenCalledWith(createBillItemDto, undefined);
      expect(result).toEqual(mockBillItem);
    });

    it('should propagate errors from datasource', async () => {
      // Arrange
      const error = new Error('Create failed');
      mockBillItemDataSource.create.mockRejectedValue(error);

      // Act & Assert
      await expect(billItemRepository.create(createBillItemDto, mockQueryRunner)).rejects.toThrow(
        'Create failed',
      );

      expect(mockBillItemDataSource.create).toHaveBeenCalledWith(
        createBillItemDto,
        mockQueryRunner,
      );
    });
  });

  describe('update', () => {
    beforeEach(() => {
      billItemRepository = new BillItemRepositoryImpl(
        mockBillItemDataSource,
        mockConstructorQueryRunner,
      );
    });

    it('should delegate update to datasource with parameter transaction', async () => {
      // Arrange
      const updatedBillItem = { ...mockBillItem, ...updateBillItemDto };
      mockBillItemDataSource.update.mockResolvedValue(updatedBillItem);

      // Act
      const result = await billItemRepository.update(1, updateBillItemDto, mockQueryRunner);

      // Assert
      expect(mockBillItemDataSource.update).toHaveBeenCalledWith(
        1,
        updateBillItemDto,
        mockQueryRunner,
      );
      expect(result).toEqual(updatedBillItem);
    });

    it('should delegate update to datasource with constructor QueryRunner when no parameter provided', async () => {
      // Arrange
      const updatedBillItem = { ...mockBillItem, ...updateBillItemDto };
      mockBillItemDataSource.update.mockResolvedValue(updatedBillItem);

      // Act
      const result = await billItemRepository.update(1, updateBillItemDto);

      // Assert
      expect(mockBillItemDataSource.update).toHaveBeenCalledWith(
        1,
        updateBillItemDto,
        mockConstructorQueryRunner,
      );
      expect(result).toEqual(updatedBillItem);
    });

    it('should delegate update to datasource with undefined when no QueryRunner available', async () => {
      // Arrange
      billItemRepository = new BillItemRepositoryImpl(mockBillItemDataSource); // No constructor QueryRunner
      const updatedBillItem = { ...mockBillItem, ...updateBillItemDto };
      mockBillItemDataSource.update.mockResolvedValue(updatedBillItem);

      // Act
      const result = await billItemRepository.update(1, updateBillItemDto);

      // Assert
      expect(mockBillItemDataSource.update).toHaveBeenCalledWith(1, updateBillItemDto, undefined);
      expect(result).toEqual(updatedBillItem);
    });

    it('should propagate errors from datasource', async () => {
      // Arrange
      const error = new Error('Update failed');
      mockBillItemDataSource.update.mockRejectedValue(error);

      // Act & Assert
      await expect(
        billItemRepository.update(1, updateBillItemDto, mockQueryRunner),
      ).rejects.toThrow('Update failed');

      expect(mockBillItemDataSource.update).toHaveBeenCalledWith(
        1,
        updateBillItemDto,
        mockQueryRunner,
      );
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      billItemRepository = new BillItemRepositoryImpl(
        mockBillItemDataSource,
        mockConstructorQueryRunner,
      );
    });

    it('should delegate delete to datasource with parameter transaction', async () => {
      // Arrange
      mockBillItemDataSource.delete.mockResolvedValue(undefined);

      // Act
      await billItemRepository.delete(1, mockQueryRunner);

      // Assert
      expect(mockBillItemDataSource.delete).toHaveBeenCalledWith(1, mockQueryRunner);
    });

    it('should delegate delete to datasource with constructor QueryRunner when no parameter provided', async () => {
      // Arrange
      mockBillItemDataSource.delete.mockResolvedValue(undefined);

      // Act
      await billItemRepository.delete(1);

      // Assert
      expect(mockBillItemDataSource.delete).toHaveBeenCalledWith(1, mockConstructorQueryRunner);
    });

    it('should delegate delete to datasource with undefined when no QueryRunner available', async () => {
      // Arrange
      billItemRepository = new BillItemRepositoryImpl(mockBillItemDataSource); // No constructor QueryRunner
      mockBillItemDataSource.delete.mockResolvedValue(undefined);

      // Act
      await billItemRepository.delete(1);

      // Assert
      expect(mockBillItemDataSource.delete).toHaveBeenCalledWith(1, undefined);
    });

    it('should propagate errors from datasource', async () => {
      // Arrange
      const error = new Error('Delete failed');
      mockBillItemDataSource.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(billItemRepository.delete(1, mockQueryRunner)).rejects.toThrow('Delete failed');

      expect(mockBillItemDataSource.delete).toHaveBeenCalledWith(1, mockQueryRunner);
    });
  });

  describe('findAll', () => {
    const mockBillItems: BillItem[] = [mockBillItem, { ...mockBillItem, id: 2, idProduct: 2 }];

    beforeEach(() => {
      billItemRepository = new BillItemRepositoryImpl(
        mockBillItemDataSource,
        mockConstructorQueryRunner,
      );
    });

    it('should delegate findAll to datasource with parameter transaction', async () => {
      // Arrange
      mockBillItemDataSource.findAll.mockResolvedValue(mockBillItems);

      // Act
      const result = await billItemRepository.findAll(mockQueryRunner);

      // Assert
      expect(mockBillItemDataSource.findAll).toHaveBeenCalledWith(mockQueryRunner);
      expect(result).toEqual(mockBillItems);
    });

    it('should delegate findAll to datasource with constructor QueryRunner when no parameter provided', async () => {
      // Arrange
      mockBillItemDataSource.findAll.mockResolvedValue(mockBillItems);

      // Act
      const result = await billItemRepository.findAll();

      // Assert
      expect(mockBillItemDataSource.findAll).toHaveBeenCalledWith(mockConstructorQueryRunner);
      expect(result).toEqual(mockBillItems);
    });

    it('should delegate findAll to datasource with undefined when no QueryRunner available', async () => {
      // Arrange
      billItemRepository = new BillItemRepositoryImpl(mockBillItemDataSource); // No constructor QueryRunner
      mockBillItemDataSource.findAll.mockResolvedValue(mockBillItems);

      // Act
      const result = await billItemRepository.findAll();

      // Assert
      expect(mockBillItemDataSource.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockBillItems);
    });

    it('should return empty array when no items found', async () => {
      // Arrange
      mockBillItemDataSource.findAll.mockResolvedValue([]);

      // Act
      const result = await billItemRepository.findAll(mockQueryRunner);

      // Assert
      expect(mockBillItemDataSource.findAll).toHaveBeenCalledWith(mockQueryRunner);
      expect(result).toEqual([]);
    });

    it('should propagate errors from datasource', async () => {
      // Arrange
      const error = new Error('FindAll failed');
      mockBillItemDataSource.findAll.mockRejectedValue(error);

      // Act & Assert
      await expect(billItemRepository.findAll(mockQueryRunner)).rejects.toThrow('FindAll failed');

      expect(mockBillItemDataSource.findAll).toHaveBeenCalledWith(mockQueryRunner);
    });
  });

  describe('QueryRunner Priority Logic', () => {
    it('should prioritize parameter QueryRunner over constructor QueryRunner', async () => {
      // Arrange
      billItemRepository = new BillItemRepositoryImpl(
        mockBillItemDataSource,
        mockConstructorQueryRunner,
      );
      mockBillItemDataSource.create.mockResolvedValue(mockBillItem);
      mockBillItemDataSource.update.mockResolvedValue(mockBillItem);
      mockBillItemDataSource.delete.mockResolvedValue(undefined);
      mockBillItemDataSource.findAll.mockResolvedValue([mockBillItem]);

      // Act - call all methods with parameter QueryRunner
      await billItemRepository.create(createBillItemDto, mockQueryRunner);
      await billItemRepository.update(1, updateBillItemDto, mockQueryRunner);
      await billItemRepository.delete(1, mockQueryRunner);
      await billItemRepository.findAll(mockQueryRunner);

      // Assert - all calls should use parameter QueryRunner, not constructor QueryRunner
      expect(mockBillItemDataSource.create).toHaveBeenCalledWith(
        createBillItemDto,
        mockQueryRunner,
      );
      expect(mockBillItemDataSource.update).toHaveBeenCalledWith(
        1,
        updateBillItemDto,
        mockQueryRunner,
      );
      expect(mockBillItemDataSource.delete).toHaveBeenCalledWith(1, mockQueryRunner);
      expect(mockBillItemDataSource.findAll).toHaveBeenCalledWith(mockQueryRunner);
    });

    it('should use constructor QueryRunner when no parameter provided', async () => {
      // Arrange
      billItemRepository = new BillItemRepositoryImpl(
        mockBillItemDataSource,
        mockConstructorQueryRunner,
      );
      mockBillItemDataSource.create.mockResolvedValue(mockBillItem);
      mockBillItemDataSource.update.mockResolvedValue(mockBillItem);
      mockBillItemDataSource.delete.mockResolvedValue(undefined);
      mockBillItemDataSource.findAll.mockResolvedValue([mockBillItem]);

      // Act - call all methods without parameter
      await billItemRepository.create(createBillItemDto);
      await billItemRepository.update(1, updateBillItemDto);
      await billItemRepository.delete(1);
      await billItemRepository.findAll();

      // Assert - all calls should use constructor QueryRunner
      expect(mockBillItemDataSource.create).toHaveBeenCalledWith(
        createBillItemDto,
        mockConstructorQueryRunner,
      );
      expect(mockBillItemDataSource.update).toHaveBeenCalledWith(
        1,
        updateBillItemDto,
        mockConstructorQueryRunner,
      );
      expect(mockBillItemDataSource.delete).toHaveBeenCalledWith(1, mockConstructorQueryRunner);
      expect(mockBillItemDataSource.findAll).toHaveBeenCalledWith(mockConstructorQueryRunner);
    });

    it('should use undefined when no QueryRunner is available', async () => {
      // Arrange
      billItemRepository = new BillItemRepositoryImpl(mockBillItemDataSource); // No constructor QueryRunner
      mockBillItemDataSource.create.mockResolvedValue(mockBillItem);
      mockBillItemDataSource.update.mockResolvedValue(mockBillItem);
      mockBillItemDataSource.delete.mockResolvedValue(undefined);
      mockBillItemDataSource.findAll.mockResolvedValue([mockBillItem]);

      // Act - call all methods without parameter
      await billItemRepository.create(createBillItemDto);
      await billItemRepository.update(1, updateBillItemDto);
      await billItemRepository.delete(1);
      await billItemRepository.findAll();

      // Assert - all calls should use undefined
      expect(mockBillItemDataSource.create).toHaveBeenCalledWith(createBillItemDto, undefined);
      expect(mockBillItemDataSource.update).toHaveBeenCalledWith(1, updateBillItemDto, undefined);
      expect(mockBillItemDataSource.delete).toHaveBeenCalledWith(1, undefined);
      expect(mockBillItemDataSource.findAll).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle all CRUD operations in sequence', async () => {
      // Arrange
      billItemRepository = new BillItemRepositoryImpl(
        mockBillItemDataSource,
        mockConstructorQueryRunner,
      );
      const updatedBillItem = { ...mockBillItem, ...updateBillItemDto };

      mockBillItemDataSource.create.mockResolvedValue(mockBillItem);
      mockBillItemDataSource.findAll.mockResolvedValue([mockBillItem]);
      mockBillItemDataSource.update.mockResolvedValue(updatedBillItem);
      mockBillItemDataSource.delete.mockResolvedValue(undefined);

      // Act & Assert - Create
      const created = await billItemRepository.create(createBillItemDto, mockQueryRunner);
      expect(created).toEqual(mockBillItem);

      // Act & Assert - FindAll
      const items = await billItemRepository.findAll(mockQueryRunner);
      expect(items).toEqual([mockBillItem]);

      // Act & Assert - Update
      const updated = await billItemRepository.update(1, updateBillItemDto, mockQueryRunner);
      expect(updated).toEqual(updatedBillItem);

      // Act & Assert - Delete
      await expect(billItemRepository.delete(1, mockQueryRunner)).resolves.toBeUndefined();

      // Verify all operations used the same QueryRunner
      expect(mockBillItemDataSource.create).toHaveBeenCalledWith(
        createBillItemDto,
        mockQueryRunner,
      );
      expect(mockBillItemDataSource.findAll).toHaveBeenCalledWith(mockQueryRunner);
      expect(mockBillItemDataSource.update).toHaveBeenCalledWith(
        1,
        updateBillItemDto,
        mockQueryRunner,
      );
      expect(mockBillItemDataSource.delete).toHaveBeenCalledWith(1, mockQueryRunner);
    });
  });

  describe('findCheapestShopsByProduct', () => {
    const mockProductPriceResults = [
      {
        shopId: 1,
        shopName: 'Shop A',
        latitude: -34.5875,
        longitude: -58.4173,
        lastPrice: 100.5,
        lastPurchaseDate: new Date('2026-01-20'),
        currency: 'ARS',
      },
      {
        shopId: 2,
        shopName: 'Shop B',
        latitude: -34.621,
        longitude: -58.371,
        lastPrice: 120.75,
        lastPurchaseDate: new Date('2026-01-18'),
        currency: 'ARS',
      },
    ];

    beforeEach(() => {
      billItemRepository = new BillItemRepositoryImpl(mockBillItemDataSource);
    });

    it('should delegate findCheapestShopsByProduct to datasource without options', async () => {
      // Arrange
      mockBillItemDataSource.findCheapestShopsByProduct.mockResolvedValue(
        mockProductPriceResults,
      );

      // Act
      const result = await billItemRepository.findCheapestShopsByProduct(123);

      // Assert
      expect(mockBillItemDataSource.findCheapestShopsByProduct).toHaveBeenCalledWith(
        123,
        undefined,
      );
      expect(result).toEqual(mockProductPriceResults);
    });

    it('should delegate findCheapestShopsByProduct to datasource with options', async () => {
      // Arrange
      const options = { maxAgeDays: 30, limit: 10 };
      mockBillItemDataSource.findCheapestShopsByProduct.mockResolvedValue(
        mockProductPriceResults,
      );

      // Act
      const result = await billItemRepository.findCheapestShopsByProduct(123, options);

      // Assert
      expect(mockBillItemDataSource.findCheapestShopsByProduct).toHaveBeenCalledWith(
        123,
        options,
      );
      expect(result).toEqual(mockProductPriceResults);
    });

    it('should return empty array when no shops found', async () => {
      // Arrange
      mockBillItemDataSource.findCheapestShopsByProduct.mockResolvedValue([]);

      // Act
      const result = await billItemRepository.findCheapestShopsByProduct(999);

      // Assert
      expect(mockBillItemDataSource.findCheapestShopsByProduct).toHaveBeenCalledWith(
        999,
        undefined,
      );
      expect(result).toEqual([]);
    });

    it('should propagate errors from datasource', async () => {
      // Arrange
      const error = new Error('Query failed');
      mockBillItemDataSource.findCheapestShopsByProduct.mockRejectedValue(error);

      // Act & Assert
      await expect(billItemRepository.findCheapestShopsByProduct(123)).rejects.toThrow(
        'Query failed',
      );

      expect(mockBillItemDataSource.findCheapestShopsByProduct).toHaveBeenCalledWith(
        123,
        undefined,
      );
    });

    it('should handle partial options correctly', async () => {
      // Arrange
      mockBillItemDataSource.findCheapestShopsByProduct.mockResolvedValue(
        mockProductPriceResults,
      );

      // Act - only maxAgeDays
      await billItemRepository.findCheapestShopsByProduct(123, { maxAgeDays: 7 });

      // Assert
      expect(mockBillItemDataSource.findCheapestShopsByProduct).toHaveBeenCalledWith(123, {
        maxAgeDays: 7,
      });

      // Act - only limit
      await billItemRepository.findCheapestShopsByProduct(456, { limit: 5 });

      // Assert
      expect(mockBillItemDataSource.findCheapestShopsByProduct).toHaveBeenCalledWith(456, {
        limit: 5,
      });
    });
  });
});
