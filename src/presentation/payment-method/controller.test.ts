import { Request, Response, NextFunction } from 'express';
import { PaymentMethodController } from './controller';
import { PaymentMethodRepository } from '../../domain/repository/payment-method.repository';
import {
  PAYMENT_METHOD_MOCK,
  paymentMethodRepositoryDomainMock,
} from '../../infrastructure/datasource/payment-method/payment-method.mock';

// Mock Use Cases
jest.mock('../../application/uses-cases/payment-method/get-payment-methods');
jest.mock('../../application/uses-cases/payment-method/create-payment-method');
jest.mock('../../application/uses-cases/payment-method/update-payment-method');
jest.mock('../../application/uses-cases/payment-method/delete-payment-method');

import { GetPaymentsMethod } from '../../application/uses-cases/payment-method/get-payment-methods';
import { CreatePaymentMethod } from '../../application/uses-cases/payment-method/create-payment-method';
import { UpdatePaymentMethod } from '../../application/uses-cases/payment-method/update-payment-method';
import { DeletePaymentMethod } from '../../application/uses-cases/payment-method/delete-payment-method';

describe('PaymentMethodController', () => {
  let controller: PaymentMethodController;
  let mockRepository: jest.Mocked<PaymentMethodRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  // Mocks de Use Cases
  let mockGetPaymentsMethod: jest.Mocked<GetPaymentsMethod>;
  let mockCreatePaymentMethod: jest.Mocked<CreatePaymentMethod>;
  let mockUpdatePaymentMethod: jest.Mocked<UpdatePaymentMethod>;
  let mockDeletePaymentMethod: jest.Mocked<DeletePaymentMethod>;

  beforeEach(() => {
    mockRepository = paymentMethodRepositoryDomainMock();
    controller = new PaymentMethodController(mockRepository);

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

    // Setup Use Cases mocks
    mockGetPaymentsMethod = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetPaymentsMethod>;

    mockCreatePaymentMethod = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreatePaymentMethod>;

    mockUpdatePaymentMethod = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UpdatePaymentMethod>;

    mockDeletePaymentMethod = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<DeletePaymentMethod>;

    // Mock constructors to return our mocked instances
    (GetPaymentsMethod as jest.MockedClass<typeof GetPaymentsMethod>).mockImplementation(
      () => mockGetPaymentsMethod,
    );
    (CreatePaymentMethod as jest.MockedClass<typeof CreatePaymentMethod>).mockImplementation(
      () => mockCreatePaymentMethod,
    );
    (UpdatePaymentMethod as jest.MockedClass<typeof UpdatePaymentMethod>).mockImplementation(
      () => mockUpdatePaymentMethod,
    );
    (DeletePaymentMethod as jest.MockedClass<typeof DeletePaymentMethod>).mockImplementation(
      () => mockDeletePaymentMethod,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPaymentMethods', () => {
    test('should return payment methods with 200 status', async () => {
      const mockPaymentMethods = [PAYMENT_METHOD_MOCK, PAYMENT_METHOD_MOCK];
      mockGetPaymentsMethod.execute.mockResolvedValue(mockPaymentMethods);

      await controller.getAllPaymentMethods(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(GetPaymentsMethod).toHaveBeenCalledWith(mockRepository);
      expect(mockGetPaymentsMethod.execute).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockPaymentMethods);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle use case error and call next with AppError', async () => {
      const error = new Error('Use case error');
      mockGetPaymentsMethod.execute.mockRejectedValue(error);

      await controller.getAllPaymentMethods(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockGetPaymentsMethod.execute).toHaveBeenCalledTimes(1);
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

  describe('createPaymentMethod', () => {
    beforeEach(() => {
      mockRequest.body = {
        name: 'Credit Card',
        description: 'Payment via credit card',
      };
    });

    test('should create payment method and return 201 status', async () => {
      const createdPaymentMethod = { ...PAYMENT_METHOD_MOCK, ...mockRequest.body };
      mockCreatePaymentMethod.execute.mockResolvedValue(createdPaymentMethod);

      await controller.createPaymentMethod(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(CreatePaymentMethod).toHaveBeenCalledWith(mockRepository);
      expect(mockCreatePaymentMethod.execute).toHaveBeenCalledWith(
        expect.objectContaining(mockRequest.body),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdPaymentMethod);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle use case error and call next with AppError', async () => {
      const error = new Error('Use case error');
      mockCreatePaymentMethod.execute.mockRejectedValue(error);

      await controller.createPaymentMethod(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockCreatePaymentMethod.execute).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalledWith(201);
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
          statusCode: 500,
        }),
      );
    });
  });

  describe('updatePaymentMethod', () => {
    beforeEach(() => {
      mockRequest.params = { id: '1' };
      mockRequest.body = {
        name: 'Updated Payment Method',
        description: 'Updated description',
      };
    });

    test('should update payment method and return 200 status', async () => {
      const updatedPaymentMethod = { ...PAYMENT_METHOD_MOCK, ...mockRequest.body, id: 1 };
      mockUpdatePaymentMethod.execute.mockResolvedValue(updatedPaymentMethod);

      await controller.updatePaymentMethod(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(UpdatePaymentMethod).toHaveBeenCalledWith(mockRepository);
      expect(mockUpdatePaymentMethod.execute).toHaveBeenCalledWith(1, mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedPaymentMethod);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle use case error and call next with AppError', async () => {
      const error = new Error('Use case error');
      mockUpdatePaymentMethod.execute.mockRejectedValue(error);

      await controller.updatePaymentMethod(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockUpdatePaymentMethod.execute).toHaveBeenCalledWith(1, mockRequest.body);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
          statusCode: 500,
        }),
      );
    });
  });

  describe('deletePaymentMethod', () => {
    beforeEach(() => {
      mockRequest.params = { id: '1' };
    });

    test('should delete payment method and return 204 status', async () => {
      mockDeletePaymentMethod.execute.mockResolvedValue(undefined);

      await controller.deletePaymentMethod(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(DeletePaymentMethod).toHaveBeenCalledWith(mockRepository);
      expect(mockDeletePaymentMethod.execute).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle use case error and call next with AppError', async () => {
      const error = new Error('Use case error');
      mockDeletePaymentMethod.execute.mockRejectedValue(error);

      await controller.deletePaymentMethod(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockDeletePaymentMethod.execute).toHaveBeenCalledWith(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
          statusCode: 500,
        }),
      );
    });
  });
});
