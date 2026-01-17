import { Request, Response, NextFunction } from 'express';
import { ShopController } from './controller';
import { ShopRepository } from '../../domain/repository/shop.repository';
import { SHOPMOCK, shopRepositoryDomainMock } from '../../infrastructure/datasource/shop/shop.mock';
import { EntityNotFoundError } from 'typeorm';

describe('ShopController', () => {
  let controller: ShopController;
  let mockRepository: jest.Mocked<ShopRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockRepository = shopRepositoryDomainMock();
    controller = new ShopController(mockRepository);

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

  describe('createShop', () => {
    beforeEach(() => {
      mockRequest.body = {
        name: 'New Shop',
        description: 'A new shop',
      };
    });

    test('should create shop and return 201 status', async () => {
      const createdShop = { ...SHOPMOCK, ...mockRequest.body };
      mockRepository.createShop.mockResolvedValue(createdShop);

      await controller.createShop(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.createShop).toHaveBeenCalledWith(
        expect.objectContaining(mockRequest.body),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdShop);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle repository error and call next with AppError', async () => {
      const error = new Error('Database error');
      mockRepository.createShop.mockRejectedValue(error);

      await controller.createShop(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.createShop).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalledWith(201);
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error creating shop',
          statusCode: 500,
        }),
      );
    });
  });

  describe('updateShop', () => {
    beforeEach(() => {
      mockRequest.params = { id: '1' };
      mockRequest.body = {
        name: 'Updated Shop',
        description: 'Updated description',
      };
    });

    test('should update shop and return 200 status', async () => {
      const updatedShop = { ...SHOPMOCK, ...mockRequest.body, id: 1 };
      mockRepository.updateShop.mockResolvedValue(updatedShop);

      await controller.updateShop(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.updateShop).toHaveBeenCalledWith(1, mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedShop);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle EntityNotFoundError and call next with 404 AppError', async () => {
      const error = new EntityNotFoundError('Shop', {});
      mockRepository.updateShop.mockRejectedValue(error);

      await controller.updateShop(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.updateShop).toHaveBeenCalledWith(1, mockRequest.body);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Shop with id 1 not found',
          statusCode: 404,
        }),
      );
    });

    test('should handle general error and call next with 500 AppError', async () => {
      const error = new Error('Database error');
      mockRepository.updateShop.mockRejectedValue(error);

      await controller.updateShop(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.updateShop).toHaveBeenCalledWith(1, mockRequest.body);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error updating shop',
          statusCode: 500,
        }),
      );
    });
  });
});
