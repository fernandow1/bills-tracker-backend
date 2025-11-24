/* eslint-disable @typescript-eslint/no-explicit-any */
import { UpdateBill, UpdateBillUseCase } from './update-bill';
import { BillRepository } from '../../../domain/repository/bill.repository';
import {
  CREATE_MOCK_BILL,
  CREATE_MOCK_UPDATE_BILL_DTO,
  CREATE_MOCK_BILL_REPOSITORY,
} from '../../../infrastructure/datasource/bill/bill.datasource.mocks';

describe('UpdateBill Use Case', () => {
  let updateBillUseCase: UpdateBillUseCase;
  let mockBillRepository: jest.Mocked<BillRepository>;

  const mockBill = CREATE_MOCK_BILL();
  const updateBillDto = CREATE_MOCK_UPDATE_BILL_DTO();

  beforeEach(() => {
    mockBillRepository = CREATE_MOCK_BILL_REPOSITORY() as jest.Mocked<BillRepository>;
    updateBillUseCase = new UpdateBill(mockBillRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update a bill successfully', async () => {
      // Arrange
      const billId = 1;
      const expectedUpdate = { ...updateBillDto, id: billId };
      mockBillRepository.update.mockResolvedValue(expectedUpdate as any);

      // Act
      const result = await updateBillUseCase.execute(billId, updateBillDto as any);

      // Assert
      expect(mockBillRepository.update).toHaveBeenCalledWith(billId, updateBillDto);
      expect(mockBillRepository.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedUpdate);
    });

    it('should handle partial updates', async () => {
      // Arrange
      const billId = 2;
      const partialUpdate = { total: 250.5 };
      const expectedResult = { ...partialUpdate, id: billId };
      mockBillRepository.update.mockResolvedValue(expectedResult as any);

      // Act
      const result = await updateBillUseCase.execute(billId, partialUpdate as any);

      // Assert
      expect(mockBillRepository.update).toHaveBeenCalledWith(billId, partialUpdate);
      expect(result).toEqual(expectedResult);
    });

    it('should handle updates with new bill items', async () => {
      // Arrange
      const billId = 1;
      const updateWithItems = {
        total: 300.0,
        billItems: [
          { idProduct: 1, quantity: 3, netPrice: 15.75 },
          { idProduct: 2, quantity: 1, netPrice: 45.5 },
        ],
      };
      mockBillRepository.update.mockResolvedValue(updateWithItems as any);

      // Act
      const result = await updateBillUseCase.execute(billId, updateWithItems as any);

      // Assert
      expect(mockBillRepository.update).toHaveBeenCalledWith(billId, updateWithItems);
      expect(result).toEqual(updateWithItems);
    });

    it('should handle updates removing all bill items', async () => {
      // Arrange
      const billId = 1;
      const updateWithoutItems = {
        total: 0.0,
        billItems: [],
      };
      mockBillRepository.update.mockResolvedValue(updateWithoutItems as any);

      // Act
      const result = await updateBillUseCase.execute(billId, updateWithoutItems as any);

      // Assert
      expect(mockBillRepository.update).toHaveBeenCalledWith(billId, updateWithoutItems);
      expect(result).toEqual(updateWithoutItems);
    });

    it('should handle bill not found scenarios', async () => {
      // Arrange
      const nonExistentId = 999;
      const notFoundError = new Error('Bill not found');
      mockBillRepository.update.mockRejectedValue(notFoundError);

      // Act & Assert
      await expect(updateBillUseCase.execute(nonExistentId, updateBillDto as any)).rejects.toThrow(
        'Bill not found',
      );
      expect(mockBillRepository.update).toHaveBeenCalledWith(nonExistentId, updateBillDto);
    });

    it('should handle validation errors on update', async () => {
      // Arrange
      const billId = 1;
      const invalidData = { total: -100 }; // Invalid negative total
      const validationError = new Error('Invalid bill data: total must be positive');
      mockBillRepository.update.mockRejectedValue(validationError);

      // Act & Assert
      await expect(updateBillUseCase.execute(billId, invalidData as any)).rejects.toThrow(
        'Invalid bill data: total must be positive',
      );
      expect(mockBillRepository.update).toHaveBeenCalledWith(billId, invalidData);
    });

    it('should handle foreign key constraint errors', async () => {
      // Arrange
      const billId = 1;
      const invalidUpdate = {
        idShop: 999, // Non-existent shop
        total: 150.0,
      };
      const constraintError = new Error('Foreign key constraint violation: shop does not exist');
      mockBillRepository.update.mockRejectedValue(constraintError);

      // Act & Assert
      await expect(updateBillUseCase.execute(billId, invalidUpdate as any)).rejects.toThrow(
        'Foreign key constraint violation: shop does not exist',
      );
    });

    it('should handle concurrent modification errors', async () => {
      // Arrange
      const billId = 1;
      const concurrencyError = new Error('Bill was modified by another transaction');
      mockBillRepository.update.mockRejectedValue(concurrencyError);

      // Act & Assert
      await expect(updateBillUseCase.execute(billId, updateBillDto as any)).rejects.toThrow(
        'Bill was modified by another transaction',
      );
    });

    it('should handle database transaction failures', async () => {
      // Arrange
      const billId = 1;
      const transactionError = new Error('Database transaction failed');
      mockBillRepository.update.mockRejectedValue(transactionError);

      // Act & Assert
      await expect(updateBillUseCase.execute(billId, updateBillDto as any)).rejects.toThrow(
        'Database transaction failed',
      );
      expect(mockBillRepository.update).toHaveBeenCalledWith(billId, updateBillDto);
    });

    it('should handle updates with zero values', async () => {
      // Arrange
      const billId = 1;
      const zeroUpdate = { total: 0 };
      mockBillRepository.update.mockResolvedValue(zeroUpdate as any);

      // Act
      const result = await updateBillUseCase.execute(billId, zeroUpdate as any);

      // Assert
      expect(mockBillRepository.update).toHaveBeenCalledWith(billId, zeroUpdate);
      expect(result).toEqual(zeroUpdate);
      expect(result.total).toBe(0);
    });

    it('should preserve unchanged fields in update result', async () => {
      // Arrange
      const billId = 1;
      const partialUpdate = { total: 175.25 };
      const fullResult = {
        id: billId,
        idShop: mockBill.idShop,
        idCurrency: mockBill.idCurrency,
        idPaymentMethod: mockBill.idPaymentMethod,
        idUser: mockBill.idUser,
        total: 175.25,
        createdAt: mockBill.createdAt,
        updatedAt: new Date('2024-01-02'),
      };
      mockBillRepository.update.mockResolvedValue(fullResult as any);

      // Act
      const result = await updateBillUseCase.execute(billId, partialUpdate as any);

      // Assert
      expect(mockBillRepository.update).toHaveBeenCalledWith(billId, partialUpdate);
      expect((result as any).id).toBe(billId);
      expect(result.total).toBe(175.25);
      expect((result as any).idShop).toBe(mockBill.idShop); // Unchanged field preserved
    });

    it('should handle empty update object', async () => {
      // Arrange
      const billId = 1;
      const emptyUpdate = {};
      const noChangeResult = { ...mockBill };
      mockBillRepository.update.mockResolvedValue(noChangeResult as any);

      // Act
      const result = await updateBillUseCase.execute(billId, emptyUpdate as any);

      // Assert
      expect(mockBillRepository.update).toHaveBeenCalledWith(billId, emptyUpdate);
      expect(result).toEqual(noChangeResult);
    });
  });
});
