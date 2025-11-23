import { GetCategories } from './get-categories';
import { CategoryRepository } from '../../../domain/repository/category.repository';
import {
  createCategoryMock,
  categoryRepositoryDomainMock,
} from '../../../infrastructure/datasource/category/category.mock';

describe('GetCategories Use Case', () => {
  let getCategoriesUseCase: GetCategories;
  let mockCategoryRepository: jest.Mocked<CategoryRepository>;

  beforeEach(() => {
    mockCategoryRepository = categoryRepositoryDomainMock();
    getCategoriesUseCase = new GetCategories(mockCategoryRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    test('should retrieve all categories successfully', async () => {
      // Arrange
      const expectedCategories = [
        createCategoryMock({ id: 1, name: 'Electronics' }),
        createCategoryMock({ id: 2, name: 'Books' }),
        createCategoryMock({ id: 3, name: 'Sports' }),
      ];

      mockCategoryRepository.getAllCategories.mockResolvedValue(expectedCategories);

      // Act
      const result = await getCategoriesUseCase.execute();

      // Assert
      expect(mockCategoryRepository.getAllCategories).toHaveBeenCalledTimes(1);
      expect(mockCategoryRepository.getAllCategories).toHaveBeenCalledWith();
      expect(result).toEqual(expectedCategories);
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('Electronics');
      expect(result[1].name).toBe('Books');
      expect(result[2].name).toBe('Sports');
    });

    test('should return empty array when no categories exist', async () => {
      // Arrange
      const expectedCategories: never[] = [];

      mockCategoryRepository.getAllCategories.mockResolvedValue(expectedCategories);

      // Act
      const result = await getCategoriesUseCase.execute();

      // Assert
      expect(mockCategoryRepository.getAllCategories).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    test('should return single category when only one exists', async () => {
      // Arrange
      const expectedCategories = [
        createCategoryMock({ id: 1, name: 'Technology', description: 'Tech items' }),
      ];

      mockCategoryRepository.getAllCategories.mockResolvedValue(expectedCategories);

      // Act
      const result = await getCategoriesUseCase.execute();

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe('Technology');
      expect(result[0].description).toBe('Tech items');
      expect(mockCategoryRepository.getAllCategories).toHaveBeenCalledWith();
    });

    test('should handle repository errors', async () => {
      // Arrange
      const repositoryError = new Error('Database connection failed');

      mockCategoryRepository.getAllCategories.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(getCategoriesUseCase.execute()).rejects.toThrow('Database connection failed');
      expect(mockCategoryRepository.getAllCategories).toHaveBeenCalledTimes(1);
    });

    test('should handle database timeout errors', async () => {
      // Arrange
      const timeoutError = new Error('Query timeout exceeded');

      mockCategoryRepository.getAllCategories.mockRejectedValue(timeoutError);

      // Act & Assert
      await expect(getCategoriesUseCase.execute()).rejects.toThrow('Query timeout exceeded');
      expect(mockCategoryRepository.getAllCategories).toHaveBeenCalledWith();
    });

    test('should return categories with all required properties', async () => {
      // Arrange
      const expectedCategories = [
        createCategoryMock({
          id: 1,
          name: 'Fashion',
          description: 'Clothing and accessories',
        }),
        createCategoryMock({
          id: 2,
          name: 'Health',
          description: null,
        }),
      ];

      mockCategoryRepository.getAllCategories.mockResolvedValue(expectedCategories);

      // Act
      const result = await getCategoriesUseCase.execute();

      // Assert
      expect(result).toHaveLength(2);

      // Verify first category
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('createdAt');
      expect(result[0]).toHaveProperty('updatedAt');
      expect(result[0]).toHaveProperty('deletedAt');

      // Verify second category
      expect(result[1].description).toBeNull();
      expect(typeof result[1].id).toBe('number');
      expect(typeof result[1].name).toBe('string');
    });
  });
});
