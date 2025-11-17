import { DeleteBrand } from './delete-brand';
import { BrandRepository } from '../../../domain/repository/brand.repository';
import { brandRepositoryDomainMock } from '../../../infrastructure/datasource/brand/brand.mock';

describe('DeleteBrand Use Case', () => {
  let deleteBrandUseCase: DeleteBrand;
  let mockBrandRepository: jest.Mocked<BrandRepository>;

  beforeEach(() => {
    mockBrandRepository = brandRepositoryDomainMock();
    deleteBrandUseCase = new DeleteBrand(mockBrandRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    test('should delete an existing brand successfully', async () => {
      // Arrange
      const brandId = 1;
      mockBrandRepository.delete.mockResolvedValue();

      // Act
      await deleteBrandUseCase.execute(brandId);

      // Assert
      expect(mockBrandRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockBrandRepository.delete).toHaveBeenCalledWith(brandId);
    });

    test('should complete without error when deleting valid brand', async () => {
      // Arrange
      const brandId = 42;
      mockBrandRepository.delete.mockResolvedValue();

      // Act & Assert
      await expect(deleteBrandUseCase.execute(brandId)).resolves.toBeUndefined();
      expect(mockBrandRepository.delete).toHaveBeenCalledWith(brandId);
    });

    test('should handle repository errors during deletion', async () => {
      // Arrange
      const brandId = 999;
      const error = new Error('Brand not found');
      mockBrandRepository.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(deleteBrandUseCase.execute(brandId)).rejects.toThrow('Brand not found');
      expect(mockBrandRepository.delete).toHaveBeenCalledWith(brandId);
    });

    test('should handle deletion of non-existent brand gracefully', async () => {
      // Arrange
      const nonExistentId = 404;
      const notFoundError = new Error('Brand with id 404 not found');
      mockBrandRepository.delete.mockRejectedValue(notFoundError);

      // Act & Assert
      await expect(deleteBrandUseCase.execute(nonExistentId)).rejects.toThrow(
        'Brand with id 404 not found',
      );
      expect(mockBrandRepository.delete).toHaveBeenCalledWith(nonExistentId);
    });

    test('should accept different brand ID formats', async () => {
      // Arrange & Act & Assert
      const testCases = [1, 100, 999999];

      mockBrandRepository.delete.mockResolvedValue();

      for (const brandId of testCases) {
        await deleteBrandUseCase.execute(brandId);
        expect(mockBrandRepository.delete).toHaveBeenCalledWith(brandId);
      }

      expect(mockBrandRepository.delete).toHaveBeenCalledTimes(testCases.length);
    });
  });
});
