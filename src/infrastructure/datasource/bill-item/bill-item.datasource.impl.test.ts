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
    billItemDatasource = new BillItemDatasourceImpl();

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
});
