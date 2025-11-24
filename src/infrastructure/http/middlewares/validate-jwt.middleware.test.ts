import { NextFunction } from 'express';
import { validateJwt } from './validate-jwt.middleware';
import { JwtTokenValidate } from '../../security/jwt-token-validate';
import { GetUser } from '../../../application/uses-cases/user/get-user';

// Mock dependencies
jest.mock('../../security/jwt-token-validate');
jest.mock('../../../application/uses-cases/user/get-user');

describe('validateJwt middleware', () => {
  let mockRequest: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  let mockResponse: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  let mockNext: NextFunction;
  let mockJwtValidator: jest.Mocked<JwtTokenValidate>;
  let mockGetUser: jest.Mocked<GetUser>;

  beforeEach(() => {
    mockRequest = {
      header: jest.fn(),
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();

    mockJwtValidator = new JwtTokenValidate() as jest.Mocked<JwtTokenValidate>;
    mockGetUser = new GetUser({} as never) as jest.Mocked<GetUser>;

    // Mock constructors
    (JwtTokenValidate as jest.Mock).mockImplementation(() => mockJwtValidator);
    (GetUser as jest.Mock).mockImplementation(() => mockGetUser);

    jest.clearAllMocks();
  });

  describe('Token validation', () => {
    it('should return 401 when no token is provided', async () => {
      mockRequest.header.mockReturnValue(undefined);

      await validateJwt(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No token provided' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when token does not start with Bearer', async () => {
      mockRequest.header.mockReturnValue('InvalidToken');

      await validateJwt(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized access' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when JWT validation returns falsy value', async () => {
      mockRequest.header.mockReturnValue('Bearer invalid-token');
      mockJwtValidator.validate.mockResolvedValue(null as never);

      await validateJwt(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid token' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when user is not found', async () => {
      const mockPayload = { sub: '123' };
      mockRequest.header.mockReturnValue('Bearer valid-token');
      mockJwtValidator.validate.mockResolvedValue(mockPayload);
      mockGetUser.execute.mockResolvedValue(null);

      await validateJwt(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User not found' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 500 when JWT validation throws error', async () => {
      const mockError = new Error('JWT validation failed');
      mockRequest.header.mockReturnValue('Bearer valid-token');
      mockJwtValidator.validate.mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await validateJwt(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to validate token' });
      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      expect(mockNext).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Successful validation', () => {
    it('should successfully validate and set user in request', async () => {
      const mockPayload = { sub: '123' };
      const mockUser = {
        id: 123,
        name: 'Test User',
        surname: 'LastName',
        email: 'test@test.com',
        username: 'testuser',
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockRequest.header.mockReturnValue('Bearer valid-token');
      mockJwtValidator.validate.mockResolvedValue(mockPayload);
      mockGetUser.execute.mockResolvedValue(mockUser);

      await validateJwt(mockRequest, mockResponse, mockNext);

      expect(mockJwtValidator.validate).toHaveBeenCalledWith('valid-token');
      expect(mockGetUser.execute).toHaveBeenCalledWith(123);
      expect(mockRequest.user).toBeDefined();
      expect(mockRequest.user).not.toHaveProperty('password');
      expect(mockRequest.user.id).toBe(123);
      expect(mockRequest.user.email).toBe('test@test.com');
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should extract token correctly from Bearer header', async () => {
      const mockPayload = { sub: '456' };
      const mockUser = {
        id: 456,
        name: 'User',
        surname: 'Test',
        email: 'user@test.com',
        username: 'user456',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockRequest.header.mockReturnValue('Bearer some-jwt-token-here');
      mockJwtValidator.validate.mockResolvedValue(mockPayload);
      mockGetUser.execute.mockResolvedValue(mockUser);

      await validateJwt(mockRequest, mockResponse, mockNext);

      expect(mockJwtValidator.validate).toHaveBeenCalledWith('some-jwt-token-here');
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    it('should handle user fetch errors', async () => {
      const mockPayload = { sub: '789' };
      const mockError = new Error('Database connection failed');

      mockRequest.header.mockReturnValue('Bearer valid-token');
      mockJwtValidator.validate.mockResolvedValue(mockPayload);
      mockGetUser.execute.mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await validateJwt(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to validate token' });
      expect(consoleSpy).toHaveBeenCalledWith(mockError);

      consoleSpy.mockRestore();
    });
  });
});
