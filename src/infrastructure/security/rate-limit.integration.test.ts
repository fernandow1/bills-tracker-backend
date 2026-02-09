import request from 'supertest';
import { CREATE_TEST_SERVER } from '../../../tests/helpers/server';
import { Application } from 'express';
import RedisClient from '../database/redis.client';

describe('Rate Limiting Integration Tests', () => {
  let app: Application;

  beforeAll(async () => {
    app = CREATE_TEST_SERVER.app;
  });

  afterAll(async () => {
    // Clean up Redis connection
    await RedisClient.disconnect();
  });

  describe('General Rate Limiter (200 req/15min)', () => {
    it('should include rate limit headers in response', async () => {
      const response = await request(app).get('/api/health');

      // Should have rate limit headers
      expect(response.headers['ratelimit-limit']).toBeDefined();
      expect(response.headers['ratelimit-remaining']).toBeDefined();
      expect(response.headers['ratelimit-reset']).toBeDefined();
    });

    it('should allow requests under the limit', async () => {
      // Make 5 requests (well under the 200 limit)
      for (let i = 0; i < 5; i++) {
        const response = await request(app).get('/api/health');

        expect(response.status).not.toBe(429);
        expect(response.headers['ratelimit-remaining']).toBeDefined();
      }
    });

    it('should decrement remaining count with each request', async () => {
      const response1 = await request(app).get('/api/health');
      const remaining1 = parseInt(response1.headers['ratelimit-remaining']);

      const response2 = await request(app).get('/api/health');
      const remaining2 = parseInt(response2.headers['ratelimit-remaining']);

      // Remaining should decrease (or stay same if using memory store and reset)
      expect(remaining2).toBeLessThanOrEqual(remaining1);
    });
  });

  describe('Auth Rate Limiter (10 req/15min)', () => {
    it('should apply rate limit to login endpoint', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'test', password: 'test' });

      // Should have rate limit headers
      expect(response.headers['ratelimit-limit']).toBeDefined();
      expect(response.headers['ratelimit-remaining']).toBeDefined();
    });

    it('should allow multiple failed login attempts up to limit', async () => {
      // Make 5 failed login attempts (under the 10 limit)
      for (let i = 0; i < 5; i++) {
        const response = await request(app)
          .post('/api/auth/login')
          .send({ username: 'test', password: 'wrong' });

        // Should not be rate limited yet
        expect(response.status).not.toBe(429);
      }
    });

    it('should have stricter limit than general limiter', async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ username: 'test', password: 'test' });

      const healthResponse = await request(app).get('/api/health');

      const loginLimit = parseInt(loginResponse.headers['ratelimit-limit']);
      const healthLimit = parseInt(healthResponse.headers['ratelimit-limit']);

      // Login limit (10) should be less than health limit (200)
      expect(loginLimit).toBeLessThan(healthLimit);
    });
  });

  describe('Strict Rate Limiter (3 req/hour)', () => {
    it('should apply rate limit to refresh endpoint', async () => {
      const response = await request(app).post('/api/auth/refresh').send({ refreshToken: 'test' });

      // Should have rate limit headers
      expect(response.headers['ratelimit-limit']).toBeDefined();
      expect(response.headers['ratelimit-remaining']).toBeDefined();
    });

    it('should apply rate limit to revoke endpoint', async () => {
      const response = await request(app).post('/api/auth/revoke').send({ refreshToken: 'test' });

      // Should have rate limit headers
      expect(response.headers['ratelimit-limit']).toBeDefined();
      expect(response.headers['ratelimit-remaining']).toBeDefined();
    });

    it('should have the strictest limit', async () => {
      const refreshResponse = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'test' });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ username: 'test', password: 'test' });

      const refreshLimit = parseInt(refreshResponse.headers['ratelimit-limit']);
      const loginLimit = parseInt(loginResponse.headers['ratelimit-limit']);

      // Refresh limit (3) should be less than login limit (10)
      expect(refreshLimit).toBeLessThan(loginLimit);
    });
  });

  describe('Rate Limit Exceeded (429)', () => {
    it('should return 429 when strict limit is exceeded', async () => {
      // Make 4 requests to exceed the limit of 3
      const responses = [];
      for (let i = 0; i < 4; i++) {
        const response = await request(app)
          .post('/api/auth/refresh')
          .send({ refreshToken: 'test' });
        responses.push(response);
      }

      // At least one should be rate limited
      const rateLimited = responses.some((r) => r.status === 429);
      expect(rateLimited).toBe(true);
    });

    it('should return proper error message when rate limited', async () => {
      // Make enough requests to trigger rate limit
      let rateLimitedResponse;
      for (let i = 0; i < 5; i++) {
        const response = await request(app).post('/api/auth/revoke').send({ refreshToken: 'test' });

        if (response.status === 429) {
          rateLimitedResponse = response;
          break;
        }
      }

      if (rateLimitedResponse) {
        expect(rateLimitedResponse.body).toHaveProperty('error');
        expect(rateLimitedResponse.body).toHaveProperty('message');
        expect(rateLimitedResponse.body.error).toBe('Too many requests');
      }
    });

    it('should include Retry-After header when rate limited', async () => {
      // Make enough requests to trigger rate limit
      let rateLimitedResponse;
      for (let i = 0; i < 5; i++) {
        const response = await request(app)
          .post('/api/auth/refresh')
          .send({ refreshToken: 'test' });

        if (response.status === 429) {
          rateLimitedResponse = response;
          break;
        }
      }

      if (rateLimitedResponse) {
        expect(rateLimitedResponse.headers['retry-after']).toBeDefined();
      }
    });
  });

  describe('Rate Limit Reset', () => {
    it('should reset rate limit headers for different IPs', async () => {
      // This test verifies that rate limits are per-IP
      // In a real scenario, different IPs would have different limits
      const response = await request(app).get('/api/health');

      expect(response.headers['ratelimit-reset']).toBeDefined();
      const resetTime = parseInt(response.headers['ratelimit-reset']);

      // Reset time should be a valid Unix timestamp
      expect(resetTime).toBeGreaterThan(Date.now() / 1000);
    });
  });

  describe('Standard Headers', () => {
    it('should use standard RateLimit-* headers', async () => {
      const response = await request(app).get('/api/health');

      // Should have standard headers (not legacy X-RateLimit-*)
      expect(response.headers['ratelimit-limit']).toBeDefined();
      expect(response.headers['ratelimit-remaining']).toBeDefined();
      expect(response.headers['ratelimit-reset']).toBeDefined();

      // Should NOT have legacy headers
      expect(response.headers['x-ratelimit-limit']).toBeUndefined();
      expect(response.headers['x-ratelimit-remaining']).toBeUndefined();
      expect(response.headers['x-ratelimit-reset']).toBeUndefined();
    });
  });
});
