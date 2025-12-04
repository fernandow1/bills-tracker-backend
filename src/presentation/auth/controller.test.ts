import { Request, Response, NextFunction } from 'express';
import { AuthController } from './controller';
import { DataSource } from 'typeorm';
import { LoginUser } from '../../application/uses-cases/auth/login-user';
import { RefreshTokenUseCase } from '../../application/uses-cases/auth/refresh-token';
import { JwtRefreshToken } from '../../infrastructure/security/jwt-refresh-token';

// Mock de todas las dependencias
jest.mock('../../application/uses-cases/auth/login-user');
jest.mock('../../application/uses-cases/auth/refresh-token');
jest.mock('../../infrastructure/security/jwt-refresh-token');

describe('AuthController', () => {
  let controller: AuthController;
  let mockDataSource: Partial<DataSource>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockDataSource = {
      getRepository: jest.fn(),
    };

    controller = new AuthController(mockDataSource as DataSource);

    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('login', () => {
    beforeEach(() => {
      mockRequest.body = {
        username: 'testuser',
        password: 'password123',
      };
    });

    it('should login user successfully with valid credentials', async () => {
      // Mock del use case
      const mockExecute = jest.fn().mockResolvedValue({
        user: {
          id: 1,
          name: 'Test',
          surname: 'User',
          username: 'testuser',
          email: 'test@example.com',
        },
        token: 'access_token',
        refreshToken: 'refresh_token',
        expiresIn: 900,
      });
      (LoginUser as jest.MockedClass<typeof LoginUser>).mockImplementation(
        () =>
          ({
            execute: mockExecute,
          }) as unknown as LoginUser,
      );

      await controller.login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: {
          id: 1,
          name: 'Test',
          surname: 'User',
          username: 'testuser',
          email: 'test@example.com',
        },
        token: 'access_token',
        refreshToken: 'refresh_token',
        expiresIn: 900, // 15 minutos en segundos
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return validation error for invalid input', async () => {
      mockRequest.body = {
        username: '', // Invalid username
        password: '123', // Invalid password (too short)
      };

      await controller.login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation failed',
        }),
      );
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should handle use case errors', async () => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { AppError } = await import('../../application/errors/app-error');
      const authError = AppError.unauthorized('Invalid username or password');
      const mockExecute = jest.fn().mockRejectedValue(authError);
      (LoginUser as jest.MockedClass<typeof LoginUser>).mockImplementation(
        () =>
          ({
            execute: mockExecute,
          }) as unknown as LoginUser,
      );

      await controller.login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid username or password',
          statusCode: 401,
        }),
      );
    });

    it('should handle missing required fields', async () => {
      mockRequest.body = {}; // Missing username and password

      await controller.login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation failed',
        }),
      );
    });
  });

  describe('refreshToken', () => {
    beforeEach(() => {
      mockRequest.body = {
        refreshToken: 'valid_refresh_token',
      };
    });

    it('should refresh token successfully', async () => {
      const mockExecute = jest.fn().mockResolvedValue({
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
        expiresIn: 900,
      });
      (RefreshTokenUseCase as jest.MockedClass<typeof RefreshTokenUseCase>).mockImplementation(
        () =>
          ({
            execute: mockExecute,
          }) as unknown as RefreshTokenUseCase,
      );

      await controller.refreshToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Token refreshed successfully',
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
        expiresIn: 900,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return validation error for missing refresh token', async () => {
      mockRequest.body = {}; // Missing refresh token

      await controller.refreshToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation failed',
        }),
      );
    });

    it('should handle expired token error', async () => {
      const mockExecute = jest.fn().mockRejectedValue(new Error('Token expired'));
      (RefreshTokenUseCase as jest.MockedClass<typeof RefreshTokenUseCase>).mockImplementation(
        () =>
          ({
            execute: mockExecute,
          }) as unknown as RefreshTokenUseCase,
      );

      await controller.refreshToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Refresh token has expired',
        }),
      );
    });

    it('should handle revoked token error', async () => {
      const mockExecute = jest.fn().mockRejectedValue(new Error('Token has been revoked'));
      (RefreshTokenUseCase as jest.MockedClass<typeof RefreshTokenUseCase>).mockImplementation(
        () =>
          ({
            execute: mockExecute,
          }) as unknown as RefreshTokenUseCase,
      );

      await controller.refreshToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Refresh token has been revoked',
        }),
      );
    });

    it('should handle general errors', async () => {
      const mockExecute = jest.fn().mockRejectedValue(new Error('Some other error'));
      (RefreshTokenUseCase as jest.MockedClass<typeof RefreshTokenUseCase>).mockImplementation(
        () =>
          ({
            execute: mockExecute,
          }) as unknown as RefreshTokenUseCase,
      );

      await controller.refreshToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Failed to refresh token',
        }),
      );
    });
  });

  describe('revokeToken', () => {
    beforeEach(() => {
      mockRequest.body = {
        refreshToken: 'valid_refresh_token',
      };
    });

    it('should revoke token successfully', async () => {
      const mockRevokeRefreshToken = jest.fn().mockResolvedValue(undefined);
      (JwtRefreshToken as jest.MockedClass<typeof JwtRefreshToken>).mockImplementation(
        () =>
          ({
            revokeRefreshToken: mockRevokeRefreshToken,
          }) as unknown as JwtRefreshToken,
      );

      await controller.revokeToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Token revoked successfully',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return validation error for missing refresh token', async () => {
      mockRequest.body = {}; // Missing refresh token

      await controller.revokeToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation failed',
        }),
      );
    });

    it('should handle invalid token error', async () => {
      const mockRevokeRefreshToken = jest
        .fn()
        .mockRejectedValue(new Error('Cannot revoke invalid token'));
      (JwtRefreshToken as jest.MockedClass<typeof JwtRefreshToken>).mockImplementation(
        () =>
          ({
            revokeRefreshToken: mockRevokeRefreshToken,
          }) as unknown as JwtRefreshToken,
      );

      await controller.revokeToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid refresh token',
        }),
      );
    });

    it('should handle general errors', async () => {
      const mockRevokeRefreshToken = jest.fn().mockRejectedValue(new Error('Database error'));
      (JwtRefreshToken as jest.MockedClass<typeof JwtRefreshToken>).mockImplementation(
        () =>
          ({
            revokeRefreshToken: mockRevokeRefreshToken,
          }) as unknown as JwtRefreshToken,
      );

      await controller.revokeToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Failed to revoke token',
        }),
      );
    });
  });

  describe('Controller initialization', () => {
    it('should create controller with DataSource dependency', () => {
      expect(controller).toBeDefined();
      expect(controller).toBeInstanceOf(AuthController);
    });

    it('should have all required methods', () => {
      expect(typeof controller.login).toBe('function');
      expect(typeof controller.refreshToken).toBe('function');
      expect(typeof controller.revokeToken).toBe('function');
    });
  });
});
