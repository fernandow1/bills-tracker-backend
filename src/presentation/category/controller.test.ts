import { Request, Response, NextFunction } from 'express';
import { CategoryController } from './controller';
import { CategoryRepository } from '../../domain/repository/category.repository';
import {
  CATEGORY_MOCK,
  createCategoryMock,
  categoryRepositoryDomainMock,
} from '../../infrastructure/datasource/category/category.mock';

describe('CategoryController', () => {
  let controller: CategoryController;
  let mockRepository: jest.Mocked<CategoryRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockRepository = categoryRepositoryDomainMock();
    controller = new CategoryController(mockRepository);

    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCategories', () => {
    test('should return categories with 200 status', async () => {
      const mockCategories = [
        CATEGORY_MOCK,
        createCategoryMock({ id: 2, name: 'Books', description: 'Books and magazines' }),
      ];
      mockRepository.getAllCategories.mockResolvedValue(mockCategories);

      await controller.getAllCategories(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.getAllCategories).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCategories);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return empty array when no categories exist', async () => {
      mockRepository.getAllCategories.mockResolvedValue([]);

      await controller.getAllCategories(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.getAllCategories).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([]);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle repository errors', async () => {
      const error = new Error('Database connection failed');
      mockRepository.getAllCategories.mockRejectedValue(error);

      await controller.getAllCategories(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.getAllCategories).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('createCategory', () => {
    test('should create category with 201 status', async () => {
      const createCategoryData = {
        name: 'Electronics',
        description: 'Electronic devices and accessories',
      };
      const createdCategory = createCategoryMock({
        id: 1,
        name: 'Electronics',
        description: 'Electronic devices and accessories',
      });

      mockRequest.body = createCategoryData;
      mockRepository.createCategory.mockResolvedValue(createdCategory);

      await controller.createCategory(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.createCategory).toHaveBeenCalledTimes(1);
      expect(mockRepository.createCategory).toHaveBeenCalledWith(createCategoryData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdCategory);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should create category without description', async () => {
      const createCategoryData = {
        name: 'Sports',
      };
      const createdCategory = createCategoryMock({
        id: 2,
        name: 'Sports',
        description: null,
      });

      mockRequest.body = createCategoryData;
      mockRepository.createCategory.mockResolvedValue(createdCategory);

      await controller.createCategory(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.createCategory).toHaveBeenCalledWith(createCategoryData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdCategory);
    });

    test('should handle validation errors for empty name', async () => {
      mockRequest.body = {
        name: '',
        description: 'Some description',
      };

      await controller.createCategory(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.createCategory).not.toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    test('should handle validation errors for missing name', async () => {
      mockRequest.body = {
        description: 'Some description',
      };

      await controller.createCategory(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.createCategory).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    test('should handle validation errors for name too long', async () => {
      mockRequest.body = {
        name: 'A'.repeat(101), // Exceeds 100 character limit
        description: 'Some description',
      };

      await controller.createCategory(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.createCategory).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    test('should handle repository errors during creation', async () => {
      const createCategoryData = {
        name: 'Technology',
        description: 'Tech products',
      };
      const error = new Error('Database error');

      mockRequest.body = createCategoryData;
      mockRepository.createCategory.mockRejectedValue(error);

      await controller.createCategory(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.createCategory).toHaveBeenCalledWith(createCategoryData);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('updateCategory', () => {
    test('should update category with 200 status', async () => {
      const updateCategoryData = {
        name: 'Updated Electronics',
        description: 'Updated description',
      };
      const updatedCategory = createCategoryMock({
        id: 1,
        name: 'Updated Electronics',
        description: 'Updated description',
      });

      mockRequest.params = { id: '1' };
      mockRequest.body = updateCategoryData;
      mockRepository.updateCategory.mockResolvedValue(updatedCategory);

      await controller.updateCategory(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.updateCategory).toHaveBeenCalledTimes(1);
      expect(mockRepository.updateCategory).toHaveBeenCalledWith(1, updateCategoryData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedCategory);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should update category with only name', async () => {
      const updateCategoryData = {
        name: 'Updated Name',
      };
      const updatedCategory = createCategoryMock({
        id: 1,
        name: 'Updated Name',
      });

      mockRequest.params = { id: '1' };
      mockRequest.body = updateCategoryData;
      mockRepository.updateCategory.mockResolvedValue(updatedCategory);

      await controller.updateCategory(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.updateCategory).toHaveBeenCalledWith(1, updateCategoryData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedCategory);
    });

    test('should handle validation errors in update', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = {
        name: '', // Empty name should fail validation
        description: 'Some description',
      };

      await controller.updateCategory(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.updateCategory).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    test('should handle repository errors during update', async () => {
      const updateCategoryData = {
        name: 'Technology',
      };
      const error = new Error('Category not found');

      mockRequest.params = { id: '999' };
      mockRequest.body = updateCategoryData;
      mockRepository.updateCategory.mockRejectedValue(error);

      await controller.updateCategory(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.updateCategory).toHaveBeenCalledWith(999, updateCategoryData);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('deleteCategory', () => {
    test('should delete category with 204 status', async () => {
      mockRequest.params = { id: '1' };
      mockRepository.deleteCategory.mockResolvedValue();

      await controller.deleteCategory(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.deleteCategory).toHaveBeenCalledTimes(1);
      expect(mockRepository.deleteCategory).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle repository errors during deletion', async () => {
      const error = new Error('Category not found');
      mockRequest.params = { id: '999' };
      mockRepository.deleteCategory.mockRejectedValue(error);

      await controller.deleteCategory(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.deleteCategory).toHaveBeenCalledWith(999);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    test('should handle foreign key constraint errors', async () => {
      const error = new Error('Cannot delete: referenced by other entities');
      mockRequest.params = { id: '1' };
      mockRepository.deleteCategory.mockRejectedValue(error);

      await controller.deleteCategory(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.deleteCategory).toHaveBeenCalledWith(1);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
