/* eslint-disable @typescript-eslint/no-explicit-any */
import { BillRepositoryImpl } from './bill.repository.impl';
import { BillDataSource } from '../../../domain/datasources/bill.datasource';
import { QueryRunner } from 'typeorm';
import {
  CREATE_MOCK_BILL,
  CREATE_MOCK_CREATE_BILL_DTO,
  CREATE_MOCK_UPDATE_BILL_DTO,
  CREATE_MOCK_SEARCH_FILTER,
} from '../../datasource/bill/bill.datasource.mocks';

describe('BillRepositoryImpl', () => {
  let repository: BillRepositoryImpl;
  let mockBillDataSource: jest.Mocked<BillDataSource>;
  let mockQueryRunner: Partial<QueryRunner>;

  const mockBill = CREATE_MOCK_BILL();
  const createBillDto = CREATE_MOCK_CREATE_BILL_DTO();
  const updateBillDto = CREATE_MOCK_UPDATE_BILL_DTO();
  const searchFilter = CREATE_MOCK_SEARCH_FILTER();

  beforeEach(() => {
    // Create mock datasource
    mockBillDataSource = {
      create: jest.fn(),
      search: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    // Create mock QueryRunner
    mockQueryRunner = {
      manager: {} as any,
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      isReleased: false,
      isTransactionActive: true,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create repository without queryRunner', () => {
      repository = new BillRepositoryImpl(mockBillDataSource);
      expect(repository).toBeDefined();
    });

    it('should create repository with queryRunner', () => {
      repository = new BillRepositoryImpl(mockBillDataSource, mockQueryRunner as QueryRunner);
      expect(repository).toBeDefined();
    });
  });

  describe('create', () => {
    beforeEach(() => {
      repository = new BillRepositoryImpl(mockBillDataSource);
    });

    describe('when no transaction is provided', () => {
      describe('and no constructor queryRunner', () => {
        it('should call datasource create with undefined transaction', async () => {
          // Arrange
          mockBillDataSource.create.mockResolvedValue(mockBill as any);

          // Act
          const result = await repository.create(createBillDto as any);

          // Assert
          expect(mockBillDataSource.create).toHaveBeenCalledWith(createBillDto, undefined);
          expect(result).toBe(mockBill);
        });
      });

      describe('and constructor queryRunner exists', () => {
        beforeEach(() => {
          repository = new BillRepositoryImpl(mockBillDataSource, mockQueryRunner as QueryRunner);
        });

        it('should call datasource create with constructor queryRunner', async () => {
          // Arrange
          mockBillDataSource.create.mockResolvedValue(mockBill as any);

          // Act
          const result = await repository.create(createBillDto as any);

          // Assert
          expect(mockBillDataSource.create).toHaveBeenCalledWith(createBillDto, mockQueryRunner);
          expect(result).toBe(mockBill);
        });
      });
    });

    describe('when transaction is provided', () => {
      it('should prioritize parameter transaction over constructor queryRunner', async () => {
        // Arrange
        repository = new BillRepositoryImpl(mockBillDataSource, mockQueryRunner as QueryRunner);
        const parameterQueryRunner = { ...mockQueryRunner, isReleased: true };
        mockBillDataSource.create.mockResolvedValue(mockBill as any);

        // Act
        const result = await repository.create(
          createBillDto as any,
          parameterQueryRunner as QueryRunner,
        );

        // Assert
        expect(mockBillDataSource.create).toHaveBeenCalledWith(createBillDto, parameterQueryRunner);
        expect(result).toBe(mockBill);
      });
    });

    describe('error handling', () => {
      it('should propagate datasource errors', async () => {
        // Arrange
        const error = new Error('Datasource error');
        mockBillDataSource.create.mockRejectedValue(error);

        // Act & Assert
        await expect(repository.create(createBillDto as any)).rejects.toThrow('Datasource error');
        expect(mockBillDataSource.create).toHaveBeenCalledWith(createBillDto, undefined);
      });
    });
  });

  describe('search', () => {
    beforeEach(() => {
      repository = new BillRepositoryImpl(mockBillDataSource);
    });

    it('should delegate to datasource search', async () => {
      // Arrange
      const expectedResult = { data: [mockBill], count: 1 };
      mockBillDataSource.search.mockResolvedValue(expectedResult as any);

      // Act
      const result = await repository.search(searchFilter as any);

      // Assert
      expect(mockBillDataSource.search).toHaveBeenCalledWith(searchFilter);
      expect(result).toBe(expectedResult);
    });

    it('should propagate datasource errors', async () => {
      // Arrange
      const error = new Error('Search error');
      mockBillDataSource.search.mockRejectedValue(error);

      // Act & Assert
      await expect(repository.search(searchFilter as any)).rejects.toThrow('Search error');
    });
  });

  describe('findById', () => {
    beforeEach(() => {
      repository = new BillRepositoryImpl(mockBillDataSource);
    });

    it('should delegate to datasource findById', async () => {
      // Arrange
      mockBillDataSource.findById.mockResolvedValue(mockBill as any);

      // Act
      const result = await repository.findById(1);

      // Assert
      expect(mockBillDataSource.findById).toHaveBeenCalledWith(1);
      expect(result).toBe(mockBill);
    });

    it('should return null when bill not found', async () => {
      // Arrange
      mockBillDataSource.findById.mockResolvedValue(null);

      // Act
      const result = await repository.findById(999);

      // Assert
      expect(mockBillDataSource.findById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    beforeEach(() => {
      repository = new BillRepositoryImpl(mockBillDataSource);
    });

    it('should delegate to datasource findAll', async () => {
      // Arrange
      const bills = [mockBill, { ...mockBill, id: 2 }];
      mockBillDataSource.findAll.mockResolvedValue(bills as any);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(mockBillDataSource.findAll).toHaveBeenCalled();
      expect(result).toBe(bills);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      repository = new BillRepositoryImpl(mockBillDataSource);
    });

    describe('when no transaction is provided', () => {
      describe('and no constructor queryRunner', () => {
        it('should call datasource update with undefined transaction', async () => {
          // Arrange
          mockBillDataSource.update.mockResolvedValue(updateBillDto as any);

          // Act
          const result = await repository.update(1, updateBillDto as any);

          // Assert
          expect(mockBillDataSource.update).toHaveBeenCalledWith(1, updateBillDto, undefined);
          expect(result).toBe(updateBillDto);
        });
      });

      describe('and constructor queryRunner exists', () => {
        beforeEach(() => {
          repository = new BillRepositoryImpl(mockBillDataSource, mockQueryRunner as QueryRunner);
        });

        it('should call datasource update with constructor queryRunner', async () => {
          // Arrange
          mockBillDataSource.update.mockResolvedValue(updateBillDto as any);

          // Act
          const result = await repository.update(1, updateBillDto as any);

          // Assert
          expect(mockBillDataSource.update).toHaveBeenCalledWith(1, updateBillDto, mockQueryRunner);
          expect(result).toBe(updateBillDto);
        });
      });
    });

    describe('when transaction is provided', () => {
      it('should prioritize parameter transaction over constructor queryRunner', async () => {
        // Arrange
        repository = new BillRepositoryImpl(mockBillDataSource, mockQueryRunner as QueryRunner);
        const parameterQueryRunner = { ...mockQueryRunner, isReleased: true };
        mockBillDataSource.update.mockResolvedValue(updateBillDto as any);

        // Act
        const result = await repository.update(
          1,
          updateBillDto as any,
          parameterQueryRunner as QueryRunner,
        );

        // Assert
        expect(mockBillDataSource.update).toHaveBeenCalledWith(
          1,
          updateBillDto,
          parameterQueryRunner,
        );
        expect(result).toBe(updateBillDto);
      });
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      repository = new BillRepositoryImpl(mockBillDataSource);
    });

    describe('when no transaction is provided', () => {
      describe('and no constructor queryRunner', () => {
        it('should call datasource delete with undefined transaction', async () => {
          // Arrange
          mockBillDataSource.delete.mockResolvedValue(undefined);

          // Act
          await repository.delete(1);

          // Assert
          expect(mockBillDataSource.delete).toHaveBeenCalledWith(1, undefined);
        });
      });

      describe('and constructor queryRunner exists', () => {
        beforeEach(() => {
          repository = new BillRepositoryImpl(mockBillDataSource, mockQueryRunner as QueryRunner);
        });

        it('should call datasource delete with constructor queryRunner', async () => {
          // Arrange
          mockBillDataSource.delete.mockResolvedValue(undefined);

          // Act
          await repository.delete(1);

          // Assert
          expect(mockBillDataSource.delete).toHaveBeenCalledWith(1, mockQueryRunner);
        });
      });
    });

    describe('when transaction is provided', () => {
      it('should prioritize parameter transaction over constructor queryRunner', async () => {
        // Arrange
        repository = new BillRepositoryImpl(mockBillDataSource, mockQueryRunner as QueryRunner);
        const parameterQueryRunner = { ...mockQueryRunner, isReleased: true };
        mockBillDataSource.delete.mockResolvedValue(undefined);

        // Act
        await repository.delete(1, parameterQueryRunner as QueryRunner);

        // Assert
        expect(mockBillDataSource.delete).toHaveBeenCalledWith(1, parameterQueryRunner);
      });
    });

    describe('error handling', () => {
      it('should propagate datasource errors', async () => {
        // Arrange
        const error = new Error('Delete error');
        mockBillDataSource.delete.mockRejectedValue(error);

        // Act & Assert
        await expect(repository.delete(1)).rejects.toThrow('Delete error');
        expect(mockBillDataSource.delete).toHaveBeenCalledWith(1, undefined);
      });
    });
  });
});
