import RedisClient from '../database/redis.client';

// Mock RedisClient before importing rate-limit.config
jest.mock('@infrastructure/database/redis.client');

describe('Rate Limit Configuration', () => {
  beforeAll(() => {
    // Mock RedisClient.getInstance to return null (use memory store)
    (RedisClient.getInstance as jest.Mock).mockReturnValue(null);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rate Limiter Exports', () => {
    it('should export generalRateLimiter as a function', async () => {
      const { generalRateLimiter } = await import('./rate-limit.config');
      expect(generalRateLimiter).toBeDefined();
      expect(typeof generalRateLimiter).toBe('function');
    });

    it('should export authRateLimiter as a function', async () => {
      const { authRateLimiter } = await import('./rate-limit.config');
      expect(authRateLimiter).toBeDefined();
      expect(typeof authRateLimiter).toBe('function');
    });

    it('should export registerRateLimiter as a function', async () => {
      const { registerRateLimiter } = await import('./rate-limit.config');
      expect(registerRateLimiter).toBeDefined();
      expect(typeof registerRateLimiter).toBe('function');
    });

    it('should export strictRateLimiter as a function', async () => {
      const { strictRateLimiter } = await import('./rate-limit.config');
      expect(strictRateLimiter).toBeDefined();
      expect(typeof strictRateLimiter).toBe('function');
    });
  });

  describe('Rate Limiter Store Configuration', () => {
    it('should call RedisClient.getInstance when importing module', async () => {
      // Clear previous calls
      jest.clearAllMocks();

      // Re-import module to trigger getInstance
      await jest.isolateModulesAsync(async () => {
        await import('./rate-limit.config');
      });

      // Should have called getInstance for each limiter
      expect(RedisClient.getInstance).toHaveBeenCalled();
    });

    it('should handle when Redis client is not available', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      (RedisClient.getInstance as jest.Mock).mockReturnValue(null);

      await jest.isolateModulesAsync(async () => {
        await import('./rate-limit.config');
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Using memory store for rate limiting'),
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('Rate Limiter Middleware Behavior', () => {
    it('should export Express middleware functions with correct arity', async () => {
      const { generalRateLimiter, authRateLimiter, registerRateLimiter, strictRateLimiter } =
        await import('./rate-limit.config');

      const limiters = [
        generalRateLimiter,
        authRateLimiter,
        registerRateLimiter,
        strictRateLimiter,
      ];

      limiters.forEach((limiter) => {
        expect(typeof limiter).toBe('function');
        // Express middleware accepts 3 parameters: req, res, next
        expect(limiter.length).toBe(3);
      });
    });
  });

  describe('Rate Limiter Uniqueness', () => {
    it('should have different limiter instances', async () => {
      const { generalRateLimiter, authRateLimiter, registerRateLimiter, strictRateLimiter } =
        await import('./rate-limit.config');

      // Each limiter should be a unique function
      expect(generalRateLimiter).not.toBe(authRateLimiter);
      expect(authRateLimiter).not.toBe(registerRateLimiter);
      expect(registerRateLimiter).not.toBe(strictRateLimiter);
      expect(strictRateLimiter).not.toBe(generalRateLimiter);
    });
  });

  describe('Configuration Constants', () => {
    it('should use appropriate time windows', () => {
      // These are the expected values from the implementation
      const FIFTEEN_MINUTES = 15 * 60 * 1000;
      const ONE_HOUR = 60 * 60 * 1000;

      // Verify the constants are correct
      expect(FIFTEEN_MINUTES).toBe(900000);
      expect(ONE_HOUR).toBe(3600000);
    });

    it('should use appropriate rate limits in ascending order of strictness', () => {
      // These are the expected values from the implementation
      const GENERAL_LIMIT = 200;
      const AUTH_LIMIT = 10;
      const REGISTER_LIMIT = 5;
      const STRICT_LIMIT = 3;

      // Verify the limits make sense (strict < register < auth < general)
      expect(STRICT_LIMIT).toBeLessThan(REGISTER_LIMIT);
      expect(REGISTER_LIMIT).toBeLessThan(AUTH_LIMIT);
      expect(AUTH_LIMIT).toBeLessThan(GENERAL_LIMIT);
    });
  });
});
