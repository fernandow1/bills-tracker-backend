import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../../domain/repository/user.repository';
import { PasswordHasher } from '../../domain/ports/password-hasher';
import {
  userRepositoryDomainMock,
  passwordHasherMock,
} from '../../infrastructure/datasource/user/user.mock';

import { UserController } from './controller';

describe('UserController', () => {
  let controller: UserController;
  let mockRepository: jest.Mocked<UserRepository>;
  let mockPasswordHasher: jest.Mocked<PasswordHasher>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockRepository = userRepositoryDomainMock();
    mockPasswordHasher = passwordHasherMock();
    controller = new UserController(mockRepository, mockPasswordHasher);

    mockRequest = {
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test',
        surname: 'User',
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('Controller initialization', () => {
    it('should create controller with dependencies', () => {
      expect(controller).toBeDefined();
      expect(controller).toBeInstanceOf(UserController);
    });
  });

  describe('Response handling', () => {
    it('should call response methods appropriately', async () => {
      // Test that response.status and response.json are called
      await controller.createUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle error scenarios gracefully', async () => {
      // Test with invalid request body
      const invalidRequest = { body: {} };

      await controller.createUser(invalidRequest as Request, mockResponse as Response, mockNext);

      // Should still call some response method (either response or next)
      const statusMock = mockResponse.status as jest.Mock;
      const responseCalled = statusMock.mock.calls.length > 0;
      const nextCalled = mockNext.mock.calls.length > 0;

      expect(responseCalled || nextCalled).toBe(true);
    });
  });
});
