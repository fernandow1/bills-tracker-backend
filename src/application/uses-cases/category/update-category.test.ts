import { UpdateCategory } from './update-category';
import { CategoryRepository } from '../../../domain/repository/category.repository';
import {
  createCategoryMock,
  updateCategoryDtoMock,
  categoryRepositoryDomainMock,
} from '../../../infrastructure/datasource/category/category.mock';

describe('UpdateCategory Use Case', () => {
  let updateCategoryUseCase: UpdateCategory;
  let mockCategoryRepository: jest.Mocked<CategoryRepository>;

  beforeEach(() => {
    mockCategoryRepository = categoryRepositoryDomainMock();
    updateCategoryUseCase = new UpdateCategory(mockCategoryRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    test('should update a category successfully', async () => {
      // Arrange
      const categoryId = 1;
      const updateCategoryDto = updateCategoryDtoMock({ name: 'Updated Electronics' });
      const expectedCategory = createCategoryMock({
        id: categoryId,
        name: 'Updated Electronics',
      });

      mockCategoryRepository.updateCategory.mockResolvedValue(expectedCategory);

      // Act
      const result = await updateCategoryUseCase.execute(categoryId, updateCategoryDto);

      // Assert
      expect(mockCategoryRepository.updateCategory).toHaveBeenCalledTimes(1);
      expect(mockCategoryRepository.updateCategory).toHaveBeenCalledWith(
        categoryId,
        updateCategoryDto,
      );
      expect(result).toEqual(expectedCategory);
      expect(result.name).toBe('Updated Electronics');
    });

    test('should update only the name field', async () => {
      // Arrange
      const categoryId = 2;
      const updateCategoryDto = updateCategoryDtoMock({ name: 'Gaming' });
      const expectedCategory = createCategoryMock({
        id: categoryId,
        name: 'Gaming',
        description: 'Original description',
      });

      mockCategoryRepository.updateCategory.mockResolvedValue(expectedCategory);

      // Act
      const result = await updateCategoryUseCase.execute(categoryId, updateCategoryDto);

      // Assert
      expect(result.id).toBe(categoryId);
      expect(result.name).toBe('Gaming');
      expect(result.description).toBe('Original description');
      expect(mockCategoryRepository.updateCategory).toHaveBeenCalledWith(
        categoryId,
        updateCategoryDto,
      );
    });

    test('should update only the description field', async () => {
      // Arrange
      const categoryId = 3;
      const updateCategoryDto = updateCategoryDtoMock({
        description: 'Updated description for books',
      });
      const expectedCategory = createCategoryMock({
        id: categoryId,
        name: 'Books',
        description: 'Updated description for books',
      });

      mockCategoryRepository.updateCategory.mockResolvedValue(expectedCategory);

      // Act
      const result = await updateCategoryUseCase.execute(categoryId, updateCategoryDto);

      // Assert
      expect(result.id).toBe(categoryId);
      expect(result.name).toBe('Books');
      expect(result.description).toBe('Updated description for books');
      expect(mockCategoryRepository.updateCategory).toHaveBeenCalledWith(
        categoryId,
        updateCategoryDto,
      );
    });

    test('should update both name and description', async () => {
      // Arrange
      const categoryId = 4;
      const updateCategoryDto = updateCategoryDtoMock({
        name: 'Home & Garden',
        description: 'Items for home and garden improvement',
      });
      const expectedCategory = createCategoryMock({
        id: categoryId,
        name: 'Home & Garden',
        description: 'Items for home and garden improvement',
      });

      mockCategoryRepository.updateCategory.mockResolvedValue(expectedCategory);

      // Act
      const result = await updateCategoryUseCase.execute(categoryId, updateCategoryDto);

      // Assert
      expect(result.name).toBe('Home & Garden');
      expect(result.description).toBe('Items for home and garden improvement');
      expect(mockCategoryRepository.updateCategory).toHaveBeenCalledWith(
        categoryId,
        updateCategoryDto,
      );
    });

    test('should handle repository errors', async () => {
      // Arrange
      const categoryId = 999;
      const updateCategoryDto = updateCategoryDtoMock({ name: 'Non-existent' });
      const repositoryError = new Error('Category not found');

      mockCategoryRepository.updateCategory.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(updateCategoryUseCase.execute(categoryId, updateCategoryDto)).rejects.toThrow(
        'Category not found',
      );
      expect(mockCategoryRepository.updateCategory).toHaveBeenCalledTimes(1);
      expect(mockCategoryRepository.updateCategory).toHaveBeenCalledWith(
        categoryId,
        updateCategoryDto,
      );
    });

    test('should handle database connection errors', async () => {
      // Arrange
      const categoryId = 1;
      const updateCategoryDto = updateCategoryDtoMock({ name: 'Technology' });
      const connectionError = new Error('Database connection failed');

      mockCategoryRepository.updateCategory.mockRejectedValue(connectionError);

      // Act & Assert
      await expect(updateCategoryUseCase.execute(categoryId, updateCategoryDto)).rejects.toThrow(
        'Database connection failed',
      );
      expect(mockCategoryRepository.updateCategory).toHaveBeenCalledWith(
        categoryId,
        updateCategoryDto,
      );
    });
  });
});
