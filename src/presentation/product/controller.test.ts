import { Request, Response, NextFunction } from 'express';
import { ProductController } from './controller';
import { ProductRepository } from '../../domain/repository/product.repository';
import { BillItemRepository } from '../../domain/repository/bill-item.repository';
import {
  PRODUCT_MOCK,
  createMockedBillItemRepositoryInterface,
  createMockedProductRepositoryInterface,
} from '../../infrastructure/datasource/product/product.mock';

describe('ProductController', () => {
  let controller: ProductController;
  let mockRepository: jest.Mocked<ProductRepository>;
  let mockBillItemRepository: jest.Mocked<BillItemRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockRepository = createMockedProductRepositoryInterface();
    mockBillItemRepository = createMockedBillItemRepositoryInterface();
    
    controller = new ProductController(mockRepository, mockBillItemRepository);

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

  describe('getProducts', () => {
    test('should return products with 200 status', async () => {
      const mockProducts = [PRODUCT_MOCK, { ...PRODUCT_MOCK, id: 2, name: 'Samsung Galaxy S24' }];
      mockRepository.getAllProducts.mockResolvedValue(mockProducts);

      await controller.getProducts(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.getAllProducts).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockProducts);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return empty array when no products exist', async () => {
      mockRepository.getAllProducts.mockResolvedValue([]);

      await controller.getProducts(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.getAllProducts).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([]);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle repository error and call next with AppError', async () => {
      const error = new Error('Database error');
      mockRepository.getAllProducts.mockRejectedValue(error);

      await controller.getProducts(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.getAllProducts).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
          statusCode: 500,
        }),
      );
    });
  });

  describe('getProduct', () => {
    beforeEach(() => {
      mockRequest.params = { id: '1' };
    });

    test('should return product with 200 status', async () => {
      mockRepository.getProductById.mockResolvedValue(PRODUCT_MOCK);

      await controller.getProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.getProductById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(PRODUCT_MOCK);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle repository error and call next with AppError', async () => {
      const error = new Error('Product not found');
      mockRepository.getProductById.mockRejectedValue(error);

      await controller.getProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.getProductById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
          statusCode: 500,
        }),
      );
    });
  });

  describe('createProduct', () => {
    beforeEach(() => {
      mockRequest.body = {
        idBrand: 1,
        idCategory: 1,
        name: 'New Product',
        description: 'Product description',
      };
    });

    test('should create product and return 201 status', async () => {
      const createdProduct = { ...PRODUCT_MOCK, ...mockRequest.body };
      mockRepository.createProduct.mockResolvedValue(createdProduct);

      await controller.createProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.createProduct).toHaveBeenCalledWith(
        expect.objectContaining(mockRequest.body),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdProduct);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle repository error and call next with AppError', async () => {
      const error = new Error('Database error');
      mockRepository.createProduct.mockRejectedValue(error);

      await controller.createProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.createProduct).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalledWith(201);
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
          statusCode: 500,
        }),
      );
    });

    test('should handle validation errors and call next with AppError', async () => {
      mockRequest.body = {}; // Missing required fields

      await controller.createProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.createProduct).not.toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation failed',
          statusCode: 400,
        }),
      );
    });

    test('should handle validation error for missing name', async () => {
      mockRequest.body = { idBrand: 1, idCategory: 1, description: 'Test description' }; // Missing name

      await controller.createProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.createProduct).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation failed',
          statusCode: 400,
        }),
      );
    });

    test('should handle validation error for empty name', async () => {
      mockRequest.body = { idBrand: 1, idCategory: 1, name: '', description: 'Test' };

      await controller.createProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.createProduct).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation failed',
          statusCode: 400,
        }),
      );
    });

    test('should handle validation error for invalid idBrand', async () => {
      mockRequest.body = {
        idBrand: 'invalid',
        idCategory: 1,
        name: 'Test Product',
        description: 'Test description',
      };

      await controller.createProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.createProduct).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation failed',
          statusCode: 400,
        }),
      );
    });
  });

  describe('updateProduct', () => {
    beforeEach(() => {
      mockRequest.params = { id: '1' };
      mockRequest.body = {
        idBrand: 1,
        idCategory: 1,
        name: 'Updated Product',
        description: 'Updated description',
      };
    });

    test('should update product and return 200 status', async () => {
      mockRepository.updateProduct.mockResolvedValue(mockRequest.body);

      await controller.updateProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.updateProduct).toHaveBeenCalledWith(
        1,
        expect.objectContaining(mockRequest.body),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockRequest.body);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle repository error and call next with AppError', async () => {
      const error = new Error('Database error');
      mockRepository.updateProduct.mockRejectedValue(error);

      await controller.updateProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.updateProduct).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalledWith(200);
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
          statusCode: 500,
        }),
      );
    });

    test('should handle validation errors and call next with AppError', async () => {
      mockRequest.body = {
        idBrand: 'invalid', // Invalid type should cause validation error
        idCategory: 1,
        name: 'Test Product',
        description: 'Test description',
      };

      await controller.updateProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.updateProduct).not.toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation failed',
          statusCode: 400,
        }),
      );
    });

    test('should handle validation error for empty name', async () => {
      mockRequest.body = { idBrand: 1, idCategory: 1, name: '', description: 'Test' };

      await controller.updateProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.updateProduct).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation failed',
          statusCode: 400,
        }),
      );
    });
  });

  describe('deleteProduct', () => {
    beforeEach(() => {
      mockRequest.params = { id: '1' };
    });

    test('should delete product and return 204 status', async () => {
      mockRepository.deleteProduct.mockResolvedValue();

      await controller.deleteProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.deleteProduct).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle repository error and call next with AppError', async () => {
      const error = new Error('Database error');
      mockRepository.deleteProduct.mockRejectedValue(error);

      await controller.deleteProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.deleteProduct).toHaveBeenCalledWith(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
          statusCode: 500,
        }),
      );
    });
  });

  describe('Edge cases', () => {
    test('should handle invalid product ID in getProduct', async () => {
      mockRequest.params = { id: 'invalid' };
      mockRepository.getProductById.mockRejectedValue(new Error('Invalid ID'));

      await controller.getProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.getProductById).toHaveBeenCalledWith(NaN);
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
          statusCode: 500,
        }),
      );
    });

    test('should handle invalid product ID in updateProduct', async () => {
      mockRequest.params = { id: 'invalid' };
      mockRequest.body = {
        idBrand: 1,
        idCategory: 1,
        name: 'Test Product',
        description: 'Test description',
      };
      mockRepository.updateProduct.mockRejectedValue(new Error('Invalid ID'));

      await controller.updateProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.updateProduct).toHaveBeenCalledWith(NaN, mockRequest.body);
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
          statusCode: 500,
        }),
      );
    });

    test('should handle invalid product ID in deleteProduct', async () => {
      mockRequest.params = { id: 'invalid' };
      mockRepository.deleteProduct.mockRejectedValue(new Error('Invalid ID'));

      await controller.deleteProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.deleteProduct).toHaveBeenCalledWith(NaN);
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
          statusCode: 500,
        }),
      );
    });
  });

  describe('Special cases', () => {
    test('should handle product with null description in create', async () => {
      mockRequest.body = {
        idBrand: 1,
        idCategory: 1,
        name: 'Product with null description',
        description: null,
      };
      const productWithNullDesc = { ...PRODUCT_MOCK, description: null };
      mockRepository.createProduct.mockResolvedValue(productWithNullDesc);

      await controller.createProduct(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.createProduct).toHaveBeenCalledWith(
        expect.objectContaining(mockRequest.body),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(productWithNullDesc);
    });
  });
});
