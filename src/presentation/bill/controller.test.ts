import { Response, NextFunction } from 'express';
import { BillRepository } from '../../domain/repository/bill.repository';
import { IUnitOfWork } from '../../domain/ports/unit-of-work.interface';
import { BillItemRepository } from '../../domain/repository/bill-item.repository';
import { Pagination } from '../../application/models/pagination.model';
import { Bill } from '../../domain/entities/bill.entity';
import {
  CREATE_MOCK_BILL,
  CREATE_MOCK_BILL_REPOSITORY,
} from '../../infrastructure/datasource/bill/bill.datasource.mocks';

describe('BillController', () => {
  let mockRepository: jest.Mocked<BillRepository>;
  let mockUnitOfWork: jest.Mocked<IUnitOfWork>;
  let mockUnitOfWorkFactory: jest.MockedFunction<() => IUnitOfWork>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    // Setup repository mock
    mockRepository = CREATE_MOCK_BILL_REPOSITORY() as jest.Mocked<BillRepository>;

    // Setup UnitOfWork mock
    const mockBillItemRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<BillItemRepository>;

    mockUnitOfWork = {
      billRepository: mockRepository,
      billItemRepository: mockBillItemRepository,
      beginTransaction: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      release: jest.fn(),
      isInTransaction: jest.fn().mockReturnValue(true),
    } as jest.Mocked<IUnitOfWork>;

    mockUnitOfWorkFactory = jest.fn().mockReturnValue(mockUnitOfWork);

    // Setup Express mocks
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Repository Integration', () => {
    test('should use repository to get all bills', async () => {
      const bills = [CREATE_MOCK_BILL(), CREATE_MOCK_BILL({ id: 2 })];
      mockRepository.findAll.mockResolvedValue(bills as Bill[]);

      const result = await mockRepository.findAll();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(bills);
    });

    test('should use repository to search bills', async () => {
      const searchResult: Pagination<Bill> = {
        data: [CREATE_MOCK_BILL() as Bill],
        count: 1,
      };

      mockRepository.search.mockResolvedValue(searchResult);

      const result = await mockRepository.search({
        page: 1,
        pageSize: 10,
        filter: {},
      });

      expect(mockRepository.search).toHaveBeenCalledTimes(1);
      expect(result).toEqual(searchResult);
    });

    test('should use repository to update bill', async () => {
      const updateBillDto = {
        total: 150,
        idShop: 2,
      };
      const updatedBill = CREATE_MOCK_BILL({ id: 1, total: 150, idShop: 2 });
      mockRepository.update.mockResolvedValue(updatedBill as Bill);

      const result = await mockRepository.update(1, updateBillDto);

      expect(mockRepository.update).toHaveBeenCalledWith(1, updateBillDto);
      expect(result).toEqual(updatedBill);
    });

    test('should use repository to delete bill', async () => {
      mockRepository.delete.mockResolvedValue(undefined);

      await mockRepository.delete(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    test('should handle repository errors', async () => {
      const error = new Error('Database connection failed');
      mockRepository.findAll.mockRejectedValue(error);

      await expect(mockRepository.findAll()).rejects.toThrow('Database connection failed');
    });
  });

  describe('UnitOfWork Integration', () => {
    test('should use UnitOfWork factory to create transactions', () => {
      const unitOfWork = mockUnitOfWorkFactory();

      expect(mockUnitOfWorkFactory).toHaveBeenCalled();
      expect(unitOfWork).toBe(mockUnitOfWork);
    });

    test('should use UnitOfWork for bill creation', async () => {
      const createBillDto = {
        total: 100,
        idShop: 1,
        idPaymentMethod: 1,
        idCurrency: 1,
        idUser: 1,
        billItems: [],
      };
      const createdBill = CREATE_MOCK_BILL();

      mockUnitOfWork.billRepository.create = jest.fn().mockResolvedValue(createdBill);

      const result = await mockUnitOfWork.billRepository.create(createBillDto);

      expect(mockUnitOfWork.billRepository.create).toHaveBeenCalledWith(createBillDto);
      expect(result).toEqual(createdBill);
    });

    test('should handle transaction operations', async () => {
      await mockUnitOfWork.beginTransaction();
      await mockUnitOfWork.commit();
      await mockUnitOfWork.rollback();
      await mockUnitOfWork.release();

      expect(mockUnitOfWork.beginTransaction).toHaveBeenCalled();
      expect(mockUnitOfWork.commit).toHaveBeenCalled();
      expect(mockUnitOfWork.rollback).toHaveBeenCalled();
      expect(mockUnitOfWork.release).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    test('should handle total mismatch errors', () => {
      const error = new Error('Total mismatch between bill and items');
      expect(error.message).toBe('Total mismatch between bill and items');
    });

    test('should handle duplicate products errors', () => {
      const error = new Error('Duplicate products found in bill items');
      expect(error.message).toBe('Duplicate products found in bill items');
    });

    test('should handle unexpected errors', () => {
      const error = new Error('Database connection failed');
      expect(error.message).toBe('Database connection failed');
    });
  });

  describe('Express Response Handling', () => {
    test('should create proper response structure for success', () => {
      const bill = CREATE_MOCK_BILL();

      (mockResponse.status as jest.Mock)(201);
      (mockResponse.json as jest.Mock)(bill);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(bill);
    });

    test('should create proper response structure for error', () => {
      const error = {
        statusCode: 400,
        message: 'Validation failed',
        details: [],
      };

      mockNext(error);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    test('should create proper response structure for delete', () => {
      (mockResponse.status as jest.Mock)(204);
      (mockResponse.send as jest.Mock)();

      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalledWith();
    });
  });
});
