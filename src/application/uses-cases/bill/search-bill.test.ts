/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchBill } from './search-bill';
import { BillRepository } from '../../../domain/repository/bill.repository';
import {
  CREATE_MOCK_BILL,
  CREATE_MOCK_SEARCH_FILTER,
  CREATE_MOCK_BILL_REPOSITORY,
} from '../../../infrastructure/datasource/bill/bill.datasource.mocks';

describe('SearchBill Use Case', () => {
  let searchBillUseCase: SearchBill;
  let mockBillRepository: jest.Mocked<BillRepository>;

  const mockBill = CREATE_MOCK_BILL();
  const searchFilter = CREATE_MOCK_SEARCH_FILTER();

  beforeEach(() => {
    mockBillRepository = CREATE_MOCK_BILL_REPOSITORY() as jest.Mocked<BillRepository>;
    searchBillUseCase = new SearchBill(mockBillRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should search bills successfully with results', async () => {
      // Arrange
      const expectedPagination = {
        data: [mockBill, { ...mockBill, id: 2 }],
        count: 2,
      };
      mockBillRepository.search.mockResolvedValue(expectedPagination as any);

      // Act
      const result = await searchBillUseCase.execute(searchFilter as any);

      // Assert
      expect(mockBillRepository.search).toHaveBeenCalledWith(searchFilter);
      expect(mockBillRepository.search).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        data: expectedPagination.data,
        count: expectedPagination.count,
      });
    });

    it('should handle empty search results', async () => {
      // Arrange
      const emptyPagination = {
        data: [],
        count: 0,
      };
      mockBillRepository.search.mockResolvedValue(emptyPagination as any);

      // Act
      const result = await searchBillUseCase.execute(searchFilter as any);

      // Assert
      expect(mockBillRepository.search).toHaveBeenCalledWith(searchFilter);
      expect(result).toEqual({
        data: [],
        count: 0,
      });
    });

    it('should handle multiple pages of results', async () => {
      // Arrange
      const multiPageFilter = {
        ...searchFilter,
        page: 2,
        pageSize: 5,
        filter: { idShop: 1, total: { gte: 100 } },
      };
      const paginatedResults = {
        data: [
          { ...mockBill, id: 6 },
          { ...mockBill, id: 7 },
          { ...mockBill, id: 8 },
        ],
        count: 25, // Total results across all pages
      };
      mockBillRepository.search.mockResolvedValue(paginatedResults as any);

      // Act
      const result = await searchBillUseCase.execute(multiPageFilter as any);

      // Assert
      expect(mockBillRepository.search).toHaveBeenCalledWith(multiPageFilter);
      expect(result).toEqual({
        data: paginatedResults.data,
        count: paginatedResults.count,
      });
      expect(result.data).toHaveLength(3);
    });

    it('should handle search with specific shop filter', async () => {
      // Arrange
      const shopFilter = CREATE_MOCK_SEARCH_FILTER({
        filter: { idShop: 5 },
        page: 1,
        pageSize: 20,
      });
      const shopResults = {
        data: [{ ...mockBill, idShop: 5 }],
        count: 1,
      };
      mockBillRepository.search.mockResolvedValue(shopResults as any);

      // Act
      const result = await searchBillUseCase.execute(shopFilter as any);

      // Assert
      expect(mockBillRepository.search).toHaveBeenCalledWith(shopFilter);
      expect(result.data[0].idShop).toBe(5);
      expect(result.count).toBe(1);
    });

    it('should handle search with date range filters', async () => {
      // Arrange
      const dateFilter = CREATE_MOCK_SEARCH_FILTER({
        filter: {
          createdAt: {
            gte: '2024-01-01',
            lte: '2024-12-31',
          },
        },
      });
      const dateResults = {
        data: [mockBill],
        count: 1,
      };
      mockBillRepository.search.mockResolvedValue(dateResults as any);

      // Act
      const result = await searchBillUseCase.execute(dateFilter as any);

      // Assert
      expect(mockBillRepository.search).toHaveBeenCalledWith(dateFilter);
      expect(result).toEqual({
        data: dateResults.data,
        count: dateResults.count,
      });
    });

    it('should handle search with amount range filters', async () => {
      // Arrange
      const amountFilter = CREATE_MOCK_SEARCH_FILTER({
        filter: {
          total: { gte: 100, lte: 500 },
        },
      });
      const amountResults = {
        data: [
          { ...mockBill, total: 150.75 },
          { ...mockBill, id: 2, total: 300.0 },
        ],
        count: 2,
      };
      mockBillRepository.search.mockResolvedValue(amountResults as any);

      // Act
      const result = await searchBillUseCase.execute(amountFilter as any);

      // Assert
      expect(mockBillRepository.search).toHaveBeenCalledWith(amountFilter);
      expect(result.count).toBe(2);
      expect(result.data).toHaveLength(2);
    });

    it('should propagate repository errors', async () => {
      // Arrange
      const error = new Error('Search index error');
      mockBillRepository.search.mockRejectedValue(error);

      // Act & Assert
      await expect(searchBillUseCase.execute(searchFilter as any)).rejects.toThrow(
        'Search index error',
      );
      expect(mockBillRepository.search).toHaveBeenCalledWith(searchFilter);
    });

    it('should handle database timeout errors', async () => {
      // Arrange
      const timeoutError = new Error('Query execution timeout');
      mockBillRepository.search.mockRejectedValue(timeoutError);

      // Act & Assert
      await expect(searchBillUseCase.execute(searchFilter as any)).rejects.toThrow(
        'Query execution timeout',
      );
    });

    it('should handle invalid filter parameters gracefully', async () => {
      // Arrange
      const invalidFilter = CREATE_MOCK_SEARCH_FILTER({
        page: -1, // Invalid page
        pageSize: 0, // Invalid page size
      });
      const validationError = new Error('Invalid pagination parameters');
      mockBillRepository.search.mockRejectedValue(validationError);

      // Act & Assert
      await expect(searchBillUseCase.execute(invalidFilter as any)).rejects.toThrow(
        'Invalid pagination parameters',
      );
    });

    it('should preserve result structure from repository', async () => {
      // Arrange
      const complexResults = {
        data: [
          {
            ...mockBill,
            billItems: [{ id: 1, idProduct: 1, quantity: 2, netPrice: 10.5 }],
          },
        ],
        count: 1,
      };
      mockBillRepository.search.mockResolvedValue(complexResults as any);

      // Act
      const result = await searchBillUseCase.execute(searchFilter as any);

      // Assert
      expect((result.data[0] as any).billItems).toBeDefined();
      expect((result.data[0] as any).billItems).toHaveLength(1);
      expect(result).toEqual({
        data: complexResults.data,
        count: complexResults.count,
      });
    });
  });
});
