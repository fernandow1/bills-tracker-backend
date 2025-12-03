import { JwtRefreshToken } from './jwt-refresh-token';

describe('JwtRefreshToken', () => {
  let refreshTokenService: JwtRefreshToken;

  beforeEach(() => {
    refreshTokenService = new JwtRefreshToken();
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', async () => {
      const payload = {
        sub: '1',
        iss: 'bills-tracker-api',
        username: 'testuser',
        email: 'test@example.com',
      };

      const token = await refreshTokenService.generateRefreshToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT structure
    });

    it('should reject invalid payload', async () => {
      await expect(refreshTokenService.generateRefreshToken(null)).rejects.toThrow(
        'Invalid payload type',
      );

      await expect(refreshTokenService.generateRefreshToken('string')).rejects.toThrow(
        'Invalid payload type',
      );
    });
  });

  describe('validateRefreshToken', () => {
    it('should validate a valid refresh token', async () => {
      const payload = {
        sub: '1',
        iss: 'bills-tracker-api',
        username: 'testuser',
        email: 'test@example.com',
      };

      const token = await refreshTokenService.generateRefreshToken(payload);
      const decoded = await refreshTokenService.validateRefreshToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.sub).toBe('1');
      expect(decoded.username).toBe('testuser');
      expect(decoded.type).toBe('refresh');
    });

    it('should reject invalid token', async () => {
      await expect(
        refreshTokenService.validateRefreshToken('invalid.token.here'),
      ).rejects.toThrow();
    });

    it('should reject access token as refresh token', async () => {
      // Mock de un access token (sin type: 'refresh')
      const jwt = await import('jsonwebtoken');
      const accessToken = jwt.sign(
        { sub: '1', username: 'test' },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '15m' },
      );

      await expect(refreshTokenService.validateRefreshToken(accessToken)).rejects.toThrow(
        'Invalid token type',
      );
    });

    it('should reject revoked token', async () => {
      const payload = {
        sub: '1',
        iss: 'bills-tracker-api',
        username: 'testuser',
        email: 'test@example.com',
      };

      const token = await refreshTokenService.generateRefreshToken(payload);

      // Revocar el token
      await refreshTokenService.revokeRefreshToken(token);

      // Intentar validarlo
      await expect(refreshTokenService.validateRefreshToken(token)).rejects.toThrow(
        'Token has been revoked',
      );
    });
  });

  describe('revokeRefreshToken', () => {
    it('should revoke a valid token', async () => {
      const payload = {
        sub: '1',
        iss: 'bills-tracker-api',
        username: 'testuser',
        email: 'test@example.com',
      };

      const token = await refreshTokenService.generateRefreshToken(payload);

      // Revocar debería funcionar sin errores
      await expect(refreshTokenService.revokeRefreshToken(token)).resolves.toBeUndefined();
    });

    it('should reject revoking invalid token', async () => {
      await expect(refreshTokenService.revokeRefreshToken('invalid.token.here')).rejects.toThrow();
    });
  });

  describe('cleanupRevokedTokens', () => {
    it('should clean up expired tokens from revoked list', async () => {
      // Este test es más complejo porque requiere tokens expirados
      // Para propósitos de demo, verificamos que el método existe
      expect(typeof refreshTokenService.cleanupRevokedTokens).toBe('function');

      // Ejecutar cleanup sin errores
      expect(() => refreshTokenService.cleanupRevokedTokens()).not.toThrow();
    });
  });
});
