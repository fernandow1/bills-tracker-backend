import { DeleteCategory } from './delete-category';
import { CategoryRepository } from '../../../domain/repository/category.repository';
import { categoryRepositoryDomainMock } from '../../../infrastructure/datasource/category/category.mock';

describe('DeleteCategory Use Case', () => {
  let deleteCategoryUseCase: DeleteCategory;
  let mockCategoryRepository: jest.Mocked<CategoryRepository>;

  beforeEach(() => {
    mockCategoryRepository = categoryRepositoryDomainMock();
    deleteCategoryUseCase = new DeleteCategory(mockCategoryRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    test('should delete a category successfully', async () => {
      // Arrange
      const categoryId = 1;

      mockCategoryRepository.deleteCategory.mockResolvedValue();

      // Act
      await deleteCategoryUseCase.execute(categoryId);

      // Assert
      expect(mockCategoryRepository.deleteCategory).toHaveBeenCalledTimes(1);
      expect(mockCategoryRepository.deleteCategory).toHaveBeenCalledWith(categoryId);
    });

    test('should delete category with valid id', async () => {
      // Arrange
      const categoryId = 42;

      mockCategoryRepository.deleteCategory.mockResolvedValue();

      // Act
      const result = await deleteCategoryUseCase.execute(categoryId);

      // Assert
      expect(result).toBeUndefined();
      expect(mockCategoryRepository.deleteCategory).toHaveBeenCalledWith(categoryId);
    });

    test('should handle repository errors when category not found', async () => {
      // Arrange
      const categoryId = 999;
      const repositoryError = new Error('Category not found');

      mockCategoryRepository.deleteCategory.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(deleteCategoryUseCase.execute(categoryId)).rejects.toThrow('Category not found');
      expect(mockCategoryRepository.deleteCategory).toHaveBeenCalledTimes(1);
      expect(mockCategoryRepository.deleteCategory).toHaveBeenCalledWith(categoryId);
    });

    test('should handle database connection errors', async () => {
      // Arrange
      const categoryId = 1;
      const connectionError = new Error('Database connection failed');

      mockCategoryRepository.deleteCategory.mockRejectedValue(connectionError);

      // Act & Assert
      await expect(deleteCategoryUseCase.execute(categoryId)).rejects.toThrow(
        'Database connection failed',
      );
      expect(mockCategoryRepository.deleteCategory).toHaveBeenCalledWith(categoryId);
    });

    test('should handle foreign key constraint errors', async () => {
      // Arrange
      const categoryId = 5;
      const constraintError = new Error('Cannot delete category: referenced by other entities');

      mockCategoryRepository.deleteCategory.mockRejectedValue(constraintError);

      // Act & Assert
      await expect(deleteCategoryUseCase.execute(categoryId)).rejects.toThrow(
        'Cannot delete category: referenced by other entities',
      );
      expect(mockCategoryRepository.deleteCategory).toHaveBeenCalledTimes(1);
      expect(mockCategoryRepository.deleteCategory).toHaveBeenCalledWith(categoryId);
    });

    test('should handle invalid category id', async () => {
      // Arrange
      const invalidCategoryId = -1;
      const validationError = new Error('Invalid category ID');

      mockCategoryRepository.deleteCategory.mockRejectedValue(validationError);

      // Act & Assert
      await expect(deleteCategoryUseCase.execute(invalidCategoryId)).rejects.toThrow(
        'Invalid category ID',
      );
      expect(mockCategoryRepository.deleteCategory).toHaveBeenCalledWith(invalidCategoryId);
    });

    test('should call repository delete method exactly once', async () => {
      // Arrange
      const categoryId = 10;

      mockCategoryRepository.deleteCategory.mockResolvedValue();

      // Act
      await deleteCategoryUseCase.execute(categoryId);
      await deleteCategoryUseCase.execute(categoryId);

      // Assert
      expect(mockCategoryRepository.deleteCategory).toHaveBeenCalledTimes(2);
      expect(mockCategoryRepository.deleteCategory).toHaveBeenNthCalledWith(1, categoryId);
      expect(mockCategoryRepository.deleteCategory).toHaveBeenNthCalledWith(2, categoryId);
    });
  });
});
