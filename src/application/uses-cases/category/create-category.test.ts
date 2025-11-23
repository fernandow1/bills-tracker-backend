import { CreateCategory } from './create-category';
import { CategoryRepository } from '../../../domain/repository/category.repository';
import {
  CATEGORY_MOCK,
  createCategoryMock,
  createCategoryDtoMock,
  categoryRepositoryDomainMock,
} from '../../../infrastructure/datasource/category/category.mock';

describe('CreateCategory Use Case', () => {
  let createCategoryUseCase: CreateCategory;
  let mockCategoryRepository: jest.Mocked<CategoryRepository>;

  beforeEach(() => {
    mockCategoryRepository = categoryRepositoryDomainMock();
    createCategoryUseCase = new CreateCategory(mockCategoryRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    test('should create a new category successfully', async () => {
      // Arrange
      const createCategoryDto = createCategoryDtoMock({ name: 'Electronics' });
      const expectedCategory = createCategoryMock({ id: 1, name: 'Electronics' });

      mockCategoryRepository.createCategory.mockResolvedValue(expectedCategory);

      // Act
      const result = await createCategoryUseCase.execute(createCategoryDto);

      // Assert
      expect(mockCategoryRepository.createCategory).toHaveBeenCalledTimes(1);
      expect(mockCategoryRepository.createCategory).toHaveBeenCalledWith(createCategoryDto);
      expect(result).toEqual(expectedCategory);
      expect(result.name).toBe('Electronics');
    });

    test('should create a category with valid data structure', async () => {
      // Arrange
      const createCategoryDto = createCategoryDtoMock({ name: 'Books' });
      const expectedCategory = { ...CATEGORY_MOCK, name: 'Books', id: 2 };

      mockCategoryRepository.createCategory.mockResolvedValue(expectedCategory);

      // Act
      const result = await createCategoryUseCase.execute(createCategoryDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(2);
      expect(result.name).toBe('Books');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect(mockCategoryRepository.createCategory).toHaveBeenCalledWith(createCategoryDto);
    });

    test('should handle repository errors', async () => {
      // Arrange
      const createCategoryDto = createCategoryDtoMock({ name: 'Sports' });
      const repositoryError = new Error('Database connection failed');

      mockCategoryRepository.createCategory.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(createCategoryUseCase.execute(createCategoryDto)).rejects.toThrow(
        'Database connection failed',
      );
      expect(mockCategoryRepository.createCategory).toHaveBeenCalledTimes(1);
      expect(mockCategoryRepository.createCategory).toHaveBeenCalledWith(createCategoryDto);
    });

    test('should create category with description', async () => {
      // Arrange
      const createCategoryDto = createCategoryDtoMock({
        name: 'Technology',
        description: 'Electronic devices and gadgets',
      });
      const expectedCategory = createCategoryMock({
        id: 3,
        name: 'Technology',
        description: 'Electronic devices and gadgets',
      });

      mockCategoryRepository.createCategory.mockResolvedValue(expectedCategory);

      // Act
      const result = await createCategoryUseCase.execute(createCategoryDto);

      // Assert
      expect(result.name).toBe('Technology');
      expect(result.description).toBe('Electronic devices and gadgets');
      expect(mockCategoryRepository.createCategory).toHaveBeenCalledWith(createCategoryDto);
    });
  });
});
