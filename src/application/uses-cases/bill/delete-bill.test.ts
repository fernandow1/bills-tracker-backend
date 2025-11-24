import { DeleteBill, DeleteBillUseCase } from './delete-bill';
import { BillRepository } from '../../../domain/repository/bill.repository';
import { CREATE_MOCK_BILL_REPOSITORY } from '../../../infrastructure/datasource/bill/bill.datasource.mocks';

describe('DeleteBill Use Case', () => {
  let deleteBillUseCase: DeleteBillUseCase;
  let mockBillRepository: jest.Mocked<BillRepository>;

  beforeEach(() => {
    mockBillRepository = CREATE_MOCK_BILL_REPOSITORY() as jest.Mocked<BillRepository>;
    deleteBillUseCase = new DeleteBill(mockBillRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete a bill successfully', async () => {
      // Arrange
      const billId = 1;
      mockBillRepository.delete.mockResolvedValue(undefined);

      // Act
      await deleteBillUseCase.execute(billId);

      // Assert
      expect(mockBillRepository.delete).toHaveBeenCalledWith(billId);
      expect(mockBillRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should handle deletion of multiple different bills', async () => {
      // Arrange
      const billIds = [1, 5, 10];
      mockBillRepository.delete.mockResolvedValue(undefined);

      // Act
      for (const billId of billIds) {
        await deleteBillUseCase.execute(billId);
      }

      // Assert
      expect(mockBillRepository.delete).toHaveBeenCalledTimes(3);
      expect(mockBillRepository.delete).toHaveBeenNthCalledWith(1, 1);
      expect(mockBillRepository.delete).toHaveBeenNthCalledWith(2, 5);
      expect(mockBillRepository.delete).toHaveBeenNthCalledWith(3, 10);
    });

    it('should handle bill not found scenarios', async () => {
      // Arrange
      const nonExistentId = 999;
      const notFoundError = new Error('Bill not found');
      mockBillRepository.delete.mockRejectedValue(notFoundError);

      // Act & Assert
      await expect(deleteBillUseCase.execute(nonExistentId)).rejects.toThrow('Bill not found');
      expect(mockBillRepository.delete).toHaveBeenCalledWith(nonExistentId);
    });

    it('should handle foreign key constraint errors', async () => {
      // Arrange
      const billId = 1;
      const constraintError = new Error('Cannot delete bill with associated items');
      mockBillRepository.delete.mockRejectedValue(constraintError);

      // Act & Assert
      await expect(deleteBillUseCase.execute(billId)).rejects.toThrow(
        'Cannot delete bill with associated items',
      );
      expect(mockBillRepository.delete).toHaveBeenCalledWith(billId);
    });

    it('should handle bills with dependent records', async () => {
      // Arrange
      const billId = 1;
      const dependencyError = new Error('Cannot delete bill: referenced by payment records');
      mockBillRepository.delete.mockRejectedValue(dependencyError);

      // Act & Assert
      await expect(deleteBillUseCase.execute(billId)).rejects.toThrow(
        'Cannot delete bill: referenced by payment records',
      );
    });

    it('should handle database connection errors', async () => {
      // Arrange
      const billId = 1;
      const connectionError = new Error('Database connection lost');
      mockBillRepository.delete.mockRejectedValue(connectionError);

      // Act & Assert
      await expect(deleteBillUseCase.execute(billId)).rejects.toThrow('Database connection lost');
      expect(mockBillRepository.delete).toHaveBeenCalledWith(billId);
    });

    it('should handle transaction rollback scenarios', async () => {
      // Arrange
      const billId = 1;
      const transactionError = new Error('Transaction was rolled back due to conflict');
      mockBillRepository.delete.mockRejectedValue(transactionError);

      // Act & Assert
      await expect(deleteBillUseCase.execute(billId)).rejects.toThrow(
        'Transaction was rolled back due to conflict',
      );
    });

    it('should handle permission denied errors', async () => {
      // Arrange
      const billId = 1;
      const permissionError = new Error('Insufficient permissions to delete bill');
      mockBillRepository.delete.mockRejectedValue(permissionError);

      // Act & Assert
      await expect(deleteBillUseCase.execute(billId)).rejects.toThrow(
        'Insufficient permissions to delete bill',
      );
    });

    it('should handle soft delete vs hard delete operations', async () => {
      // Arrange - Testing that the use case doesn't care about delete implementation
      const billId = 1;
      mockBillRepository.delete.mockResolvedValue(undefined);

      // Act
      await deleteBillUseCase.execute(billId);

      // Assert - Just ensures the repository method is called correctly
      expect(mockBillRepository.delete).toHaveBeenCalledWith(billId);
      // The actual soft/hard delete logic is handled at repository/datasource level
    });

    it('should handle concurrent deletion attempts', async () => {
      // Arrange
      const billId = 1;
      const concurrencyError = new Error('Bill was already deleted by another process');
      mockBillRepository.delete.mockRejectedValue(concurrencyError);

      // Act & Assert
      await expect(deleteBillUseCase.execute(billId)).rejects.toThrow(
        'Bill was already deleted by another process',
      );
    });

    it('should handle deletion with zero or negative IDs gracefully', async () => {
      // Arrange
      const invalidIds = [0, -1, -999];
      const validationError = new Error('Invalid bill ID');
      mockBillRepository.delete.mockRejectedValue(validationError);

      // Act & Assert
      for (const invalidId of invalidIds) {
        await expect(deleteBillUseCase.execute(invalidId)).rejects.toThrow('Invalid bill ID');
      }

      expect(mockBillRepository.delete).toHaveBeenCalledTimes(3);
    });

    it('should handle database timeout during deletion', async () => {
      // Arrange
      const billId = 1;
      const timeoutError = new Error('Delete operation timed out');
      mockBillRepository.delete.mockRejectedValue(timeoutError);

      // Act & Assert
      await expect(deleteBillUseCase.execute(billId)).rejects.toThrow('Delete operation timed out');
      expect(mockBillRepository.delete).toHaveBeenCalledWith(billId);
    });

    it('should handle system-level errors', async () => {
      // Arrange
      const billId = 1;
      const systemError = new Error('System temporarily unavailable');
      mockBillRepository.delete.mockRejectedValue(systemError);

      // Act & Assert
      await expect(deleteBillUseCase.execute(billId)).rejects.toThrow(
        'System temporarily unavailable',
      );
    });
  });
});
