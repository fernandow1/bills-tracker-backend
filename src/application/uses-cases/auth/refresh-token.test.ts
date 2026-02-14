import { RefreshTokenUseCase } from './refresh-token';
import { GenerateToken } from '../../../domain/ports/generate-token';
import { RefreshToken } from '../../../domain/ports/refresh-token';
import { isHttpError } from '../../errors/http-error.interface';

// Mocks
const MOCK_GENERATE_TOKEN: jest.Mocked<GenerateToken> = {
  generate: jest.fn(),
};

const MOCK_REFRESH_TOKEN: jest.Mocked<RefreshToken> = {
  generateRefreshToken: jest.fn(),
  validateRefreshToken: jest.fn(),
  revokeRefreshToken: jest.fn(),
};

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RefreshTokenUseCase(MOCK_GENERATE_TOKEN, MOCK_REFRESH_TOKEN);
  });

  describe('execute', () => {
    const mockDecodedToken = {
      sub: '1',
      username: 'testuser',
      email: 'test@example.com',
      jti: 'unique-jwt-id',
      type: 'refresh',
      iat: 1234567890,
      exp: 1234567890,
      iss: 'bills-tracker',
      aud: 'bills-tracker-client',
    };

    it('should refresh tokens successfully', async () => {
      // Arrange
      const refreshTokenStr = 'valid.refresh.token';
      const newAccessToken = 'new.access.token';
      const newRefreshToken = 'new.refresh.token';

      MOCK_REFRESH_TOKEN.validateRefreshToken.mockResolvedValue(mockDecodedToken);
      MOCK_GENERATE_TOKEN.generate.mockResolvedValue(newAccessToken);
      MOCK_REFRESH_TOKEN.generateRefreshToken.mockResolvedValue(newRefreshToken);
      // MOCK_REFRESH_TOKEN.revokeRefreshToken.mockResolvedValue(); // TODO: No implementado aún

      // Act
      const result = await useCase.execute(refreshTokenStr);

      // Assert
      expect(result).toEqual({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 3600,
      });

      expect(MOCK_REFRESH_TOKEN.validateRefreshToken).toHaveBeenCalledWith(refreshTokenStr);
      expect(MOCK_GENERATE_TOKEN.generate).toHaveBeenCalledWith(
        {
          sub: '1',
          username: 'testuser',
          email: 'test@example.com',
        },
        '1h',
      );
      expect(MOCK_REFRESH_TOKEN.generateRefreshToken).toHaveBeenCalledWith({
        sub: '1',
        username: 'testuser',
        email: 'test@example.com',
      });
      // TODO: Descomentar cuando se implemente la revocación de tokens
      // expect(MOCK_REFRESH_TOKEN.revokeRefreshToken).toHaveBeenCalledWith(refreshTokenStr);
    });

    it('should throw error when refresh token is invalid', async () => {
      // Arrange
      const refreshTokenStr = 'invalid.refresh.token';
      MOCK_REFRESH_TOKEN.validateRefreshToken.mockRejectedValue(new Error('invalid'));

      // Act & Assert
      await expect(useCase.execute(refreshTokenStr)).rejects.toMatchObject({
        message: 'Invalid refresh token',
        statusCode: 403,
      });
    });

    it('should throw error when decoded token has no sub', async () => {
      // Arrange
      const refreshTokenStr = 'valid.refresh.token';
      const invalidDecodedToken = { ...mockDecodedToken, sub: undefined };

      MOCK_REFRESH_TOKEN.validateRefreshToken.mockResolvedValue(invalidDecodedToken);

      // Act & Assert
      const error = await useCase.execute(refreshTokenStr).catch((e) => e);
      expect(isHttpError(error)).toBe(true);
      expect(error.statusCode).toBe(403);
    });

    it('should throw error when access token generation fails', async () => {
      // Arrange
      const refreshTokenStr = 'valid.refresh.token';

      MOCK_REFRESH_TOKEN.validateRefreshToken.mockResolvedValue(mockDecodedToken);
      MOCK_GENERATE_TOKEN.generate.mockResolvedValue(undefined);

      // Act & Assert
      const error = await useCase.execute(refreshTokenStr).catch((e) => e);
      expect(isHttpError(error)).toBe(true);
      expect(error.statusCode).toBe(500);
    });

    it('should handle refresh token rotation failure gracefully', async () => {
      // Arrange
      const refreshTokenStr = 'valid.refresh.token';
      const newAccessToken = 'new.access.token';
      const newRefreshToken = 'new.refresh.token';

      MOCK_REFRESH_TOKEN.validateRefreshToken.mockResolvedValue(mockDecodedToken);
      MOCK_GENERATE_TOKEN.generate.mockResolvedValue(newAccessToken);
      MOCK_REFRESH_TOKEN.generateRefreshToken.mockResolvedValue(newRefreshToken);
      MOCK_REFRESH_TOKEN.revokeRefreshToken.mockRejectedValue(new Error('Revoke failed'));

      // Act - Should not throw despite revoke failing
      const result = await useCase.execute(refreshTokenStr);

      // Assert
      expect(result).toEqual({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 3600,
      });
    });

    it('should handle expired refresh token', async () => {
      // Arrange
      const refreshTokenStr = 'expired.refresh.token';
      const expiredError = new Error('Token expired');

      MOCK_REFRESH_TOKEN.validateRefreshToken.mockRejectedValue(expiredError);

      // Act & Assert
      await expect(useCase.execute(refreshTokenStr)).rejects.toThrow('Refresh token has expired');
    });

    it('should handle revoked refresh token', async () => {
      // Arrange
      const refreshTokenStr = 'revoked.refresh.token';
      const revokedError = new Error('Token revoked');

      MOCK_REFRESH_TOKEN.validateRefreshToken.mockRejectedValue(revokedError);

      // Act & Assert
      await expect(useCase.execute(refreshTokenStr)).rejects.toThrow(
        'Refresh token has been revoked',
      );
    });
  });
});
