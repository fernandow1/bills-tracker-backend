/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateBill, CreateBillUseCase } from './create-bill';
import { BillRepository } from '../../../domain/repository/bill.repository';
import {
  CREATE_MOCK_BILL,
  CREATE_MOCK_CREATE_BILL_DTO,
  CREATE_MOCK_BILL_REPOSITORY,
} from '../../../infrastructure/datasource/bill/bill.datasource.mocks';

describe('CreateBill Use Case', () => {
  let createBillUseCase: CreateBillUseCase;
  let mockBillRepository: jest.Mocked<BillRepository>;

  const mockBill = CREATE_MOCK_BILL();
  const createBillDto = CREATE_MOCK_CREATE_BILL_DTO();

  beforeEach(() => {
    mockBillRepository = CREATE_MOCK_BILL_REPOSITORY() as jest.Mocked<BillRepository>;
    createBillUseCase = new CreateBill(mockBillRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a bill successfully', async () => {
      // Arrange
      mockBillRepository.create.mockResolvedValue(mockBill as any);

      // Act
      const result = await createBillUseCase.execute(createBillDto as any);

      // Assert
      expect(mockBillRepository.create).toHaveBeenCalledWith(createBillDto);
      expect(mockBillRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockBill);
    });

    it('should propagate repository errors', async () => {
      // Arrange
      const error = new Error('Repository error');
      mockBillRepository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(createBillUseCase.execute(createBillDto as any)).rejects.toThrow(
        'Repository error',
      );
      expect(mockBillRepository.create).toHaveBeenCalledWith(createBillDto);
    });

    it('should handle validation errors', async () => {
      // Arrange
      const validationError = new Error('Validation failed');
      mockBillRepository.create.mockRejectedValue(validationError);

      // Act & Assert
      await expect(createBillUseCase.execute(createBillDto as any)).rejects.toThrow(
        'Validation failed',
      );
    });

    it('should handle database constraint errors', async () => {
      // Arrange
      const constraintError = new Error('Foreign key constraint violation');
      mockBillRepository.create.mockRejectedValue(constraintError);

      // Act & Assert
      await expect(createBillUseCase.execute(createBillDto as any)).rejects.toThrow(
        'Foreign key constraint violation',
      );
    });

    it('should handle empty bill items array', async () => {
      // Arrange
      const billWithoutItems = { ...createBillDto, billItems: [] };
      const expectedBill = { ...mockBill, billItems: [] };
      mockBillRepository.create.mockResolvedValue(expectedBill as any);

      // Act
      const result = await createBillUseCase.execute(billWithoutItems as any);

      // Assert
      expect(mockBillRepository.create).toHaveBeenCalledWith(billWithoutItems);
      expect(result).toEqual(expectedBill);
    });
  });
});
