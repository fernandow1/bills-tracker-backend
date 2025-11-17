import { Request, Response, NextFunction } from 'express';
import { BrandController } from './controller';
import { BrandRepository } from '../../domain/repository/brand.repository';
import {
  BRAND_MOCK,
  brandRepositoryDomainMock,
} from '../../infrastructure/datasource/brand/brand.mock';

describe('BrandController', () => {
  let controller: BrandController;
  let mockRepository: jest.Mocked<BrandRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockRepository = brandRepositoryDomainMock();
    controller = new BrandController(mockRepository);

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

  describe('getBrands', () => {
    test('should return brands with 200 status', async () => {
      const mockBrands = [BRAND_MOCK, { ...BRAND_MOCK, id: 2, name: 'Adidas' }];
      mockRepository.findAll.mockResolvedValue(mockBrands);

      await controller.getBrands(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockBrands);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return empty array when no brands exist', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      await controller.getBrands(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([]);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle repository error and call next with AppError', async () => {
      const error = new Error('Database error');
      mockRepository.findAll.mockRejectedValue(error);

      await controller.getBrands(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
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

  describe('createBrand', () => {
    beforeEach(() => {
      mockRequest.body = {
        name: 'Nike',
      };
    });

    test('should create brand and return 201 status', async () => {
      const createdBrand = { ...BRAND_MOCK, ...mockRequest.body };
      mockRepository.create.mockResolvedValue(createdBrand);

      await controller.createBrand(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining(mockRequest.body));
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdBrand);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle repository error and call next with AppError', async () => {
      const error = new Error('Database error');
      mockRepository.create.mockRejectedValue(error);

      await controller.createBrand(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalledWith(201);
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
          statusCode: 500,
        }),
      );
    });

    test('should handle validation errors and call next with AppError', async () => {
      mockRequest.body = {}; // Missing required name field

      await controller.createBrand(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation failed',
          statusCode: 400,
        }),
      );
    });

    test('should handle validation error for empty name', async () => {
      mockRequest.body = { name: '' };

      await controller.createBrand(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation failed',
          statusCode: 400,
        }),
      );
    });

    test('should handle validation error for name exceeding max length', async () => {
      mockRequest.body = { name: 'A'.repeat(51) }; // Exceeds 50 character limit

      await controller.createBrand(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation failed',
          statusCode: 400,
        }),
      );
    });

    test('should handle validation error for non-string name', async () => {
      mockRequest.body = { name: 123 };

      await controller.createBrand(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation failed',
          statusCode: 400,
        }),
      );
    });
  });

  describe('updateBrand', () => {
    beforeEach(() => {
      mockRequest.body = {
        name: 'Updated Nike',
      };
      mockRequest.params = {
        id: '1',
      };
    });

    test('should update brand and return 200 status', async () => {
      const updatedBrand = { ...BRAND_MOCK, ...mockRequest.body };
      mockRepository.update.mockResolvedValue(updatedBrand);

      await controller.updateBrand(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining(mockRequest.body),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedBrand);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle partial update with only name', async () => {
      mockRequest.body = { name: 'Partially Updated' };
      const updatedBrand = { ...BRAND_MOCK, name: 'Partially Updated' };
      mockRepository.update.mockResolvedValue(updatedBrand);

      await controller.updateBrand(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.update).toHaveBeenCalledWith(1, mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedBrand);
    });

    test('should handle empty update body successfully', async () => {
      mockRequest.body = {}; // Empty body should be valid for updates
      const existingBrand = BRAND_MOCK;
      mockRepository.update.mockResolvedValue(existingBrand);

      await controller.updateBrand(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.update).toHaveBeenCalledWith(1, {});
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(existingBrand);
    });

    test('should handle repository error and call next with AppError', async () => {
      const error = new Error('Database error');
      mockRepository.update.mockRejectedValue(error);

      await controller.updateBrand(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalledWith(200);
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
          statusCode: 500,
        }),
      );
    });

    test('should handle validation error for name exceeding max length', async () => {
      mockRequest.body = { name: 'A'.repeat(51) }; // Exceeds 50 character limit

      await controller.updateBrand(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.update).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation failed',
          statusCode: 400,
        }),
      );
    });

    test('should handle validation error for non-string name', async () => {
      mockRequest.body = { name: 123 };

      await controller.updateBrand(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.update).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation failed',
          statusCode: 400,
        }),
      );
    });
  });

  describe('deleteBrand', () => {
    beforeEach(() => {
      mockRequest.params = {
        id: '1',
      };
    });

    test('should delete brand and return 204 status', async () => {
      mockRepository.delete.mockResolvedValue();

      await controller.deleteBrand(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalledWith();
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle deletion of non-existent brand gracefully', async () => {
      mockRepository.delete.mockResolvedValue(); // Soft delete doesn't throw error for non-existent

      await controller.deleteBrand(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalledWith();
    });

    test('should handle repository error and call next with AppError', async () => {
      const error = new Error('Database error');
      mockRepository.delete.mockRejectedValue(error);

      await controller.deleteBrand(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalledWith(204);
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
          statusCode: 500,
        }),
      );
    });

    test('should handle invalid ID parameter', async () => {
      mockRequest.params = { id: 'invalid-id' };
      mockRepository.delete.mockResolvedValue();

      await controller.deleteBrand(mockRequest as Request, mockResponse as Response, mockNext);

      // Controller converts to Number, so 'invalid-id' becomes NaN
      expect(mockRepository.delete).toHaveBeenCalledWith(NaN);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
    });
  });

  describe('Edge cases and error handling', () => {
    test('should handle unexpected errors in createBrand', async () => {
      mockRequest.body = { name: 'Valid Name' };
      // Simulate an unexpected error (not validation or repository error)
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      mockRepository.create.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      await controller.createBrand(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
          statusCode: 500,
        }),
      );

      consoleLogSpy.mockRestore();
    });

    test('should handle unexpected errors in updateBrand', async () => {
      mockRequest.body = { name: 'Valid Name' };
      mockRequest.params = { id: '1' };
      mockRepository.update.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      await controller.updateBrand(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
          statusCode: 500,
        }),
      );
    });

    test('should handle unexpected errors in deleteBrand', async () => {
      mockRequest.params = { id: '1' };
      mockRepository.delete.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      await controller.deleteBrand(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
          statusCode: 500,
        }),
      );
    });

    test('should handle unexpected errors in getBrands', async () => {
      mockRepository.findAll.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      await controller.getBrands(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
          statusCode: 500,
        }),
      );
    });
  });
});
