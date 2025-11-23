import { CategoryDataSourceImpl } from './category.datasource.impl';
import { DataSource, DeleteResult } from 'typeorm';
import {
  createCategoryMock,
  createCategoryDtoMock,
  createCategoryTypeOrmRepositoryMock,
  createTypeOrmDataSourceMock,
} from './category.mock';

describe('CategoryDataSourceImpl', () => {
  let categoryDataSource: CategoryDataSourceImpl;
  let mockDataSource: DataSource;
  let mockRepository: ReturnType<typeof createCategoryTypeOrmRepositoryMock>;

  beforeEach(() => {
    mockRepository = createCategoryTypeOrmRepositoryMock();
    mockDataSource = createTypeOrmDataSourceMock() as unknown as DataSource;
    (mockDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

    categoryDataSource = new CategoryDataSourceImpl(mockDataSource);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createCategory', () => {
    test('should create a category successfully', async () => {
      // Arrange
      const createCategoryDto = createCategoryDtoMock({
        name: 'Electronics',
        description: 'Electronic devices',
      });
      const expectedCategory = createCategoryMock({
        name: 'Electronics',
        description: 'Electronic devices',
      });

      mockRepository.create.mockReturnValue(expectedCategory);
      mockRepository.save.mockResolvedValue(expectedCategory);

      // Act
      const result = await categoryDataSource.createCategory(createCategoryDto);

      // Assert
      expect(mockDataSource.getRepository).toHaveBeenCalledTimes(2);
      expect(mockRepository.create).toHaveBeenCalledWith(createCategoryDto);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedCategory);
      expect(result).toEqual(expectedCategory);
    });

    test('should handle repository errors during creation', async () => {
      // Arrange
      const createCategoryDto = createCategoryDtoMock();
      const error = new Error('Database connection failed');

      const mockCategory = createCategoryMock();
      mockRepository.create.mockReturnValue(mockCategory);
      mockRepository.save.mockRejectedValue(error);

      // Act & Assert
      await expect(categoryDataSource.createCategory(createCategoryDto)).rejects.toThrow(
        'Database connection failed',
      );
      expect(mockDataSource.getRepository).toHaveBeenCalledTimes(2);
    });
  });

  describe('getAllCategories', () => {
    test('should retrieve all categories', async () => {
      // Arrange
      const expectedCategories = [
        createCategoryMock({ id: 1, name: 'Electronics' }),
        createCategoryMock({ id: 2, name: 'Clothing' }),
      ];

      mockRepository.find.mockResolvedValue(expectedCategories);

      // Act
      const result = await categoryDataSource.getAllCategories();

      // Assert
      expect(mockDataSource.getRepository).toHaveBeenCalledTimes(1);
      expect(mockRepository.find).toHaveBeenCalledWith();
      expect(result).toEqual(expectedCategories);
    });

    test('should return empty array when no categories exist', async () => {
      // Arrange
      mockRepository.find.mockResolvedValue([]);

      // Act
      const result = await categoryDataSource.getAllCategories();

      // Assert
      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    test('should handle repository errors during find all', async () => {
      // Arrange
      const error = new Error('Database query failed');
      mockRepository.find.mockRejectedValue(error);

      // Act & Assert
      await expect(categoryDataSource.getAllCategories()).rejects.toThrow('Database query failed');
    });
  });

  describe('updateCategory', () => {
    test('should update a category successfully', async () => {
      // Arrange
      const categoryId = 1;
      const updateDto = createCategoryDtoMock({ name: 'Updated Electronics' });
      const existingCategory = createCategoryMock({ id: categoryId, name: 'Electronics' });
      const updatedCategory = createCategoryMock({ id: categoryId, name: 'Updated Electronics' });

      mockRepository.findOneOrFail.mockResolvedValue(existingCategory);
      mockRepository.merge.mockImplementation(() => updatedCategory);
      mockRepository.save.mockResolvedValue(updatedCategory);

      // Act
      const result = await categoryDataSource.updateCategory(categoryId, updateDto);

      // Assert
      expect(mockDataSource.getRepository).toHaveBeenCalledTimes(3);
      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id: categoryId } });
      expect(mockRepository.merge).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.id).toBe(categoryId);
      expect(result.name).toBe('Updated Electronics');
    });

    test('should handle category not found during update', async () => {
      // Arrange
      const categoryId = 999;
      const updateDto = createCategoryDtoMock();
      const error = new Error('Entity not found');

      mockRepository.findOneOrFail.mockRejectedValue(error);

      // Act & Assert
      await expect(categoryDataSource.updateCategory(categoryId, updateDto)).rejects.toThrow(
        'Entity not found',
      );
      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id: categoryId } });
      expect(mockRepository.merge).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    test('should handle repository errors during update', async () => {
      // Arrange
      const categoryId = 1;
      const updateDto = createCategoryDtoMock();
      const existingCategory = createCategoryMock({ id: categoryId });
      const error = new Error('Database update failed');

      mockRepository.findOneOrFail.mockResolvedValue(existingCategory);
      mockRepository.merge.mockImplementation(() => existingCategory);
      mockRepository.save.mockRejectedValue(error);

      // Act & Assert
      await expect(categoryDataSource.updateCategory(categoryId, updateDto)).rejects.toThrow(
        'Database update failed',
      );
    });
  });

  describe('deleteCategory', () => {
    test('should soft delete a category successfully', async () => {
      // Arrange
      const categoryId = 1;

      mockRepository.softDelete.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      } as DeleteResult);

      // Act
      await categoryDataSource.deleteCategory(categoryId);

      // Assert
      expect(mockDataSource.getRepository).toHaveBeenCalledTimes(1);
      expect(mockRepository.softDelete).toHaveBeenCalledWith(categoryId);
    });

    test('should handle deletion when category does not exist', async () => {
      // Arrange
      const categoryId = 999;

      mockRepository.softDelete.mockResolvedValue({
        affected: 0,
        raw: [],
        generatedMaps: [],
      } as DeleteResult);

      // Act & Assert
      await expect(categoryDataSource.deleteCategory(categoryId)).resolves.toBeUndefined();
      expect(mockRepository.softDelete).toHaveBeenCalledWith(categoryId);
    });

    test('should handle repository errors during deletion', async () => {
      // Arrange
      const categoryId = 1;
      const error = new Error('Database deletion failed');

      mockRepository.softDelete.mockRejectedValue(error);

      // Act & Assert
      await expect(categoryDataSource.deleteCategory(categoryId)).rejects.toThrow(
        'Database deletion failed',
      );
    });
  });
});
