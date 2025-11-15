import { Request, Response, NextFunction } from 'express';
import { CurrencyController } from './controller';
import { CurrencyRepository } from '../../domain/repository/currency.repository';
import {
  CURRENCY_MOCK,
  currencyRepositoryDomainMock,
} from '../../infrastructure/datasource/currency/currency.mock';
import { EntityNotFoundError } from 'typeorm';

describe('CurrencyController', () => {
  let controller: CurrencyController;
  let mockRepository: jest.Mocked<CurrencyRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockRepository = currencyRepositoryDomainMock();
    controller = new CurrencyController(mockRepository);

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

  describe('getCurrencies', () => {
    test('should return currencies with 200 status', async () => {
      const mockCurrencies = [CURRENCY_MOCK, CURRENCY_MOCK];
      mockRepository.getCurrencies.mockResolvedValue(mockCurrencies);

      await controller.getCurrencies(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.getCurrencies).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCurrencies);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle repository error and call next with AppError', async () => {
      const error = new Error('Database error');
      mockRepository.getCurrencies.mockRejectedValue(error);

      await controller.getCurrencies(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.getCurrencies).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error fetching currencies',
          statusCode: 500,
        }),
      );
    });
  });

  describe('createCurrency', () => {
    beforeEach(() => {
      mockRequest.body = {
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
      };
    });

    test('should create currency and return 201 status', async () => {
      const createdCurrency = { ...CURRENCY_MOCK, ...mockRequest.body };
      mockRepository.createCurrency.mockResolvedValue(createdCurrency);

      await controller.createCurrency(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.createCurrency).toHaveBeenCalledWith(
        expect.objectContaining(mockRequest.body),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdCurrency);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle repository error and call next with AppError', async () => {
      const error = new Error('Database error');
      mockRepository.createCurrency.mockRejectedValue(error);

      await controller.createCurrency(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.createCurrency).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalledWith(201);
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error creating currency',
          statusCode: 500,
        }),
      );
    });
  });

  describe('updateCurrency', () => {
    beforeEach(() => {
      mockRequest.params = { id: '1' };
      mockRequest.body = {
        name: 'Updated Dollar',
        symbol: '$',
      };
    });

    test('should update currency and return 200 status', async () => {
      const updatedCurrency = { ...CURRENCY_MOCK, ...mockRequest.body, id: 1 };
      mockRepository.updateCurrency.mockResolvedValue(updatedCurrency);

      await controller.updateCurrency(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.updateCurrency).toHaveBeenCalledWith(1, mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedCurrency);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle EntityNotFoundError and call next with 404 AppError', async () => {
      const error = new EntityNotFoundError('Currency', {});
      mockRepository.updateCurrency.mockRejectedValue(error);

      await controller.updateCurrency(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.updateCurrency).toHaveBeenCalledWith(1, mockRequest.body);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Currency with id 1 not found',
          statusCode: 404,
        }),
      );
    });

    test('should handle general error and call next with 500 AppError', async () => {
      const error = new Error('Database error');
      mockRepository.updateCurrency.mockRejectedValue(error);

      await controller.updateCurrency(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.updateCurrency).toHaveBeenCalledWith(1, mockRequest.body);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error updating currency',
          statusCode: 500,
        }),
      );
    });
  });

  describe('deleteCurrency', () => {
    beforeEach(() => {
      mockRequest.params = { id: '1' };
    });

    test('should delete currency and return 204 status', async () => {
      mockRepository.deleteCurrency.mockResolvedValue(undefined);

      await controller.deleteCurrency(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.deleteCurrency).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle EntityNotFoundError and call next with 404 AppError', async () => {
      const error = new EntityNotFoundError('Currency', {});
      mockRepository.deleteCurrency.mockRejectedValue(error);

      await controller.deleteCurrency(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.deleteCurrency).toHaveBeenCalledWith(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Currency with id 1 not found',
          statusCode: 404,
        }),
      );
    });

    test('should handle general error and call next with 500 AppError', async () => {
      const error = new Error('Database error');
      mockRepository.deleteCurrency.mockRejectedValue(error);

      await controller.deleteCurrency(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRepository.deleteCurrency).toHaveBeenCalledWith(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error deleting currency',
          statusCode: 500,
        }),
      );
    });
  });
});
