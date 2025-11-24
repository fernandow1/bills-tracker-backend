/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetBills, GetBillsUseCase } from './get-bills';
import { BillRepository } from '../../../domain/repository/bill.repository';
import {
  CREATE_MOCK_BILL,
  CREATE_MOCK_BILL_REPOSITORY,
} from '../../../infrastructure/datasource/bill/bill.datasource.mocks';

describe('GetBills Use Case', () => {
  let getBillsUseCase: GetBillsUseCase;
  let mockBillRepository: jest.Mocked<BillRepository>;

  const mockBill = CREATE_MOCK_BILL();

  beforeEach(() => {
    mockBillRepository = CREATE_MOCK_BILL_REPOSITORY() as jest.Mocked<BillRepository>;
    getBillsUseCase = new GetBills(mockBillRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should get all bills successfully', async () => {
      // Arrange
      const bills = [mockBill, { ...mockBill, id: 2 }, { ...mockBill, id: 3 }];
      mockBillRepository.findAll.mockResolvedValue(bills as any);

      // Act
      const result = await getBillsUseCase.execute();

      // Assert
      expect(mockBillRepository.findAll).toHaveBeenCalledTimes(1);
      expect(mockBillRepository.findAll).toHaveBeenCalledWith();
      expect(result).toEqual(bills);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no bills found', async () => {
      // Arrange
      mockBillRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await getBillsUseCase.execute();

      // Assert
      expect(mockBillRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return single bill', async () => {
      // Arrange
      const singleBill = [mockBill];
      mockBillRepository.findAll.mockResolvedValue(singleBill as any);

      // Act
      const result = await getBillsUseCase.execute();

      // Assert
      expect(mockBillRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(singleBill);
      expect(result).toHaveLength(1);
    });

    it('should propagate repository errors', async () => {
      // Arrange
      const error = new Error('Database connection error');
      mockBillRepository.findAll.mockRejectedValue(error);

      // Act & Assert
      await expect(getBillsUseCase.execute()).rejects.toThrow('Database connection error');
      expect(mockBillRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle timeout errors', async () => {
      // Arrange
      const timeoutError = new Error('Query timeout');
      mockBillRepository.findAll.mockRejectedValue(timeoutError);

      // Act & Assert
      await expect(getBillsUseCase.execute()).rejects.toThrow('Query timeout');
      expect(mockBillRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should preserve bill order returned by repository', async () => {
      // Arrange
      const orderedBills = [
        { ...mockBill, id: 3, createdAt: new Date('2024-01-03') },
        { ...mockBill, id: 1, createdAt: new Date('2024-01-01') },
        { ...mockBill, id: 2, createdAt: new Date('2024-01-02') },
      ];
      mockBillRepository.findAll.mockResolvedValue(orderedBills as any);

      // Act
      const result = await getBillsUseCase.execute();

      // Assert
      expect(result).toEqual(orderedBills);
      expect(result[0].id).toBe(3); // Should maintain repository order
      expect(result[1].id).toBe(1);
      expect(result[2].id).toBe(2);
    });
  });
});
