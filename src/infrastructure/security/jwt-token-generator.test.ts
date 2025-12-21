import jwt from 'jsonwebtoken';
import { JwtTokenGenerator } from './jwt-token-generator';
import { envs } from '../config/env';

describe('JwtTokenGenerator', () => {
  let tokenGenerator: JwtTokenGenerator;

  beforeEach(() => {
    tokenGenerator = new JwtTokenGenerator();
  });

  describe('generate', () => {
    it('should generate a valid JWT token with correct claims', async () => {
      const payload = {
        sub: '123',
        username: 'testuser',
        email: 'test@example.com',
      };

      const token = await tokenGenerator.generate(payload, '15m');

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token?.split('.')).toHaveLength(3); // JWT structure

      // Decodificar el token para verificar los claims
      const decoded = jwt.decode(token!) as any;

      expect(decoded.sub).toBe('123');
      expect(decoded.username).toBe('testuser');
      expect(decoded.email).toBe('test@example.com');

      // CRÍTICO: Verificar issuer y audience
      expect(decoded.iss).toBe('bills-tracker-api');
      expect(decoded.aud).toBe('bills-tracker-client');

      // Verificar que tiene expiración
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
    });

    it('should generate tokens with correct expiration time', async () => {
      const payload = { sub: '123', username: 'test' };
      const token = await tokenGenerator.generate(payload, '1h');

      const decoded = jwt.decode(token!) as any;
      const expirationTime = decoded.exp - decoded.iat;

      // 1 hora = 3600 segundos
      expect(expirationTime).toBe(3600);
    });

    it('should generate different tokens for same payload', async () => {
      const payload = { sub: '123', username: 'test' };

      const token1 = await tokenGenerator.generate(payload, '15m');
      // Pequeño delay para asegurar diferentes timestamps (iat)
      await new Promise((resolve) => setTimeout(resolve, 1100));
      const token2 = await tokenGenerator.generate(payload, '15m');

      expect(token1).not.toBe(token2); // Diferentes por iat
    });

    it('should reject invalid payload', async () => {
      await expect(tokenGenerator.generate(null, '15m')).rejects.toThrow('Invalid payload type');
      await expect(tokenGenerator.generate('string', '15m')).rejects.toThrow(
        'Invalid payload type',
      );
      await expect(tokenGenerator.generate(123, '15m')).rejects.toThrow('Invalid payload type');
    });

    it('should reject invalid duration format', async () => {
      const payload = { sub: '123' };

      await expect(tokenGenerator.generate(payload, 'invalid')).rejects.toThrow(
        'Invalid payload type',
      );
      await expect(tokenGenerator.generate(payload, '15minutes')).rejects.toThrow(
        'Invalid payload type',
      );
      await expect(tokenGenerator.generate(payload, 15)).rejects.toThrow('Invalid payload type');
    });

    it('should accept valid duration formats', async () => {
      const payload = { sub: '123' };

      await expect(tokenGenerator.generate(payload, '15m')).resolves.toBeDefined();
      await expect(tokenGenerator.generate(payload, '1h')).resolves.toBeDefined();
      await expect(tokenGenerator.generate(payload, '7d')).resolves.toBeDefined();
      await expect(tokenGenerator.generate(payload, '30s')).resolves.toBeDefined();
    });

    it('should generate verifiable tokens', async () => {
      const payload = { sub: '123', username: 'test' };
      const token = await tokenGenerator.generate(payload, '15m');

      // Verificar que el token puede ser validado
      const decoded = jwt.verify(token!, envs.JWT_SECRET) as any;

      expect(decoded.sub).toBe('123');
      expect(decoded.username).toBe('test');
      expect(decoded.iss).toBe('bills-tracker-api');
      expect(decoded.aud).toBe('bills-tracker-client');
    });

    it('should reject expired tokens on verification', async () => {
      const payload = { sub: '123' };
      const token = await tokenGenerator.generate(payload, '1s');

      // Esperar a que expire
      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect(() => {
        jwt.verify(token!, envs.JWT_SECRET);
      }).toThrow('jwt expired');
    });
  });
});
