/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import jwt from 'jsonwebtoken';
import { JwtTokenValidate } from './jwt-token-validate';

jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('JwtTokenValidate', () => {
  let jwtValidator: JwtTokenValidate;

  beforeEach(() => {
    jwtValidator = new JwtTokenValidate();
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  describe('validate', () => {
    it('should resolve with payload when token is valid', async () => {
      const mockPayload = { sub: '123', iat: 1234567890 };

      mockedJwt.verify.mockImplementation((token, secret, callback: any) => {
        callback(null, mockPayload);
      });

      const result = await jwtValidator.validate('valid-token');

      expect(result).toEqual(mockPayload);
      expect(mockedJwt.verify).toHaveBeenCalledWith(
        'valid-token',
        'test-secret',
        expect.any(Function),
      );
    });

    it('should reject when token is invalid', async () => {
      const mockError = new Error('invalid token');

      mockedJwt.verify.mockImplementation((token, secret, callback: any) => {
        callback(mockError, null);
      });

      await expect(jwtValidator.validate('invalid-token')).rejects.toThrow('invalid token');
    });

    it('should reject when token is expired', async () => {
      const mockError = new Error('jwt expired');

      mockedJwt.verify.mockImplementation((token, secret, callback: any) => {
        callback(mockError, null);
      });

      await expect(jwtValidator.validate('expired-token')).rejects.toThrow('jwt expired');
    });

    it('should handle malformed tokens', async () => {
      const mockError = new Error('jwt malformed');

      mockedJwt.verify.mockImplementation((token, secret, callback: any) => {
        callback(mockError, null);
      });

      await expect(jwtValidator.validate('malformed.token')).rejects.toThrow('jwt malformed');
    });

    it('should use environment JWT_SECRET', async () => {
      process.env.JWT_SECRET = 'custom-secret';

      mockedJwt.verify.mockImplementation((token, secret, callback: any) => {
        callback(null, { sub: '123' });
      });

      await jwtValidator.validate('some-token');

      expect(mockedJwt.verify).toHaveBeenCalledWith(
        'some-token',
        'custom-secret',
        expect.any(Function),
      );
    });

    it('should work with undefined JWT_SECRET', async () => {
      delete process.env.JWT_SECRET;

      mockedJwt.verify.mockImplementation((token, secret, callback: any) => {
        callback(null, { sub: '123' });
      });

      await jwtValidator.validate('some-token');

      expect(mockedJwt.verify).toHaveBeenCalledWith('some-token', undefined, expect.any(Function));
    });

    it('should return complete payload', async () => {
      const completePayload = {
        sub: '456',
        iat: 1640995200,
        exp: 1640998800,
        aud: 'bills-tracker',
        iss: 'bills-tracker-api',
      };

      mockedJwt.verify.mockImplementation((token, secret, callback: any) => {
        callback(null, completePayload);
      });

      const result = await jwtValidator.validate('complete-token');

      expect(result).toEqual(completePayload);
      expect(result.sub).toBe('456');
      expect(result.iat).toBe(1640995200);
      expect(result.exp).toBe(1640998800);
    });
  });
});
