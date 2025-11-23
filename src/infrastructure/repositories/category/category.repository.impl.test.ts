import { CategoryRepositoryImpl } from './category.repository.impl';
import { CategoryDataSource } from '../../../domain/datasources/category.datasource';
import {
  createCategoryMock,
  createCategoryDtoMock,
  createCategoryDataSourceDomainMock,
} from '../../datasource/category/category.mock';

describe('CategoryRepositoryImpl', () => {
  let categoryRepository: CategoryRepositoryImpl;
  let mockDatasource: jest.Mocked<CategoryDataSource>;

  beforeEach(() => {
    mockDatasource = createCategoryDataSourceDomainMock();
    categoryRepository = new CategoryRepositoryImpl(mockDatasource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    test('should create a category successfully', async () => {
      // Arrange
      const createCategoryDto = createCategoryDtoMock({ name: 'Electronics' });
      const expectedCategory = createCategoryMock({ name: 'Electronics' });

      mockDatasource.createCategory.mockResolvedValue(expectedCategory);

      // Act
      const result = await categoryRepository.createCategory(createCategoryDto);

      // Assert
      expect(mockDatasource.createCategory).toHaveBeenCalledWith(createCategoryDto);
      expect(result).toEqual(expectedCategory);
    });

    test('should handle datasource errors during creation', async () => {
      // Arrange
      const createCategoryDto = createCategoryDtoMock();
      const error = new Error('Datasource creation failed');

      mockDatasource.createCategory.mockRejectedValue(error);

      // Act & Assert
      await expect(categoryRepository.createCategory(createCategoryDto)).rejects.toThrow(
        'Datasource creation failed',
      );
      expect(mockDatasource.createCategory).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('updateCategory', () => {
    test('should update a category successfully', async () => {
      // Arrange
      const categoryId = 1;
      const updateDto = createCategoryDtoMock({ name: 'Updated Electronics' });
      const expectedCategory = createCategoryMock({
        id: categoryId,
        name: 'Updated Electronics',
      });

      mockDatasource.updateCategory.mockResolvedValue(expectedCategory);

      // Act
      const result = await categoryRepository.updateCategory(categoryId, updateDto);

      // Assert
      expect(mockDatasource.updateCategory).toHaveBeenCalledWith(categoryId, updateDto);
      expect(result).toEqual(expectedCategory);
    });

    test('should handle datasource errors during update', async () => {
      // Arrange
      const categoryId = 1;
      const updateDto = createCategoryDtoMock();
      const error = new Error('Datasource update failed');

      mockDatasource.updateCategory.mockRejectedValue(error);

      // Act & Assert
      await expect(categoryRepository.updateCategory(categoryId, updateDto)).rejects.toThrow(
        'Datasource update failed',
      );
      expect(mockDatasource.updateCategory).toHaveBeenCalledWith(categoryId, updateDto);
    });
  });

  describe('getAllCategories', () => {
    test('should retrieve all categories successfully', async () => {
      // Arrange
      const expectedCategories = [
        createCategoryMock({ id: 1, name: 'Electronics' }),
        createCategoryMock({ id: 2, name: 'Books' }),
      ];

      mockDatasource.getAllCategories.mockResolvedValue(expectedCategories);

      // Act
      const result = await categoryRepository.getAllCategories();

      // Assert
      expect(mockDatasource.getAllCategories).toHaveBeenCalledWith();
      expect(result).toEqual(expectedCategories);
    });

    test('should return empty array when no categories exist', async () => {
      // Arrange
      const expectedCategories: never[] = [];

      mockDatasource.getAllCategories.mockResolvedValue(expectedCategories);

      // Act
      const result = await categoryRepository.getAllCategories();

      // Assert
      expect(mockDatasource.getAllCategories).toHaveBeenCalledWith();
      expect(result).toEqual([]);
    });

    test('should handle datasource errors during retrieval', async () => {
      // Arrange
      const error = new Error('Datasource retrieval failed');

      mockDatasource.getAllCategories.mockRejectedValue(error);

      // Act & Assert
      await expect(categoryRepository.getAllCategories()).rejects.toThrow(
        'Datasource retrieval failed',
      );
      expect(mockDatasource.getAllCategories).toHaveBeenCalledWith();
    });
  });

  describe('deleteCategory', () => {
    test('should delete a category successfully', async () => {
      // Arrange
      const categoryId = 1;

      mockDatasource.deleteCategory.mockResolvedValue();

      // Act
      await categoryRepository.deleteCategory(categoryId);

      // Assert
      expect(mockDatasource.deleteCategory).toHaveBeenCalledWith(categoryId);
    });

    test('should handle datasource errors during deletion', async () => {
      // Arrange
      const categoryId = 1;
      const error = new Error('Datasource deletion failed');

      mockDatasource.deleteCategory.mockRejectedValue(error);

      // Act & Assert
      await expect(categoryRepository.deleteCategory(categoryId)).rejects.toThrow(
        'Datasource deletion failed',
      );
      expect(mockDatasource.deleteCategory).toHaveBeenCalledWith(categoryId);
    });
  });
});
