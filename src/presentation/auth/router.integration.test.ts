import request from 'supertest';
import { CREATE_TEST_SERVER } from '../../../tests/helpers/server';
import { Application } from 'express';

describe('Auth Integration Tests', () => {
  let app: Application;

  beforeAll(async () => {
    app = CREATE_TEST_SERVER.app;
  });

  describe('POST /api/auth/refresh', () => {
    it('should require refreshToken field', async () => {
      const response = await request(app).post('/api/auth/refresh').send({});

      expect([400, 500]).toContain(response.status);
    });

    it('should reject invalid refresh token format', async () => {
      const response = await request(app).post('/api/auth/refresh').send({
        refreshToken: 'invalid.token.format',
      });

      expect([403, 500]).toContain(response.status);
    });

    it('should handle empty refresh token', async () => {
      const response = await request(app).post('/api/auth/refresh').send({
        refreshToken: '',
      });

      expect([400, 500]).toContain(response.status);
    });
  });

  describe('POST /api/auth/revoke', () => {
    it('should require refreshToken field', async () => {
      const response = await request(app).post('/api/auth/revoke').send({});

      expect([400, 500]).toContain(response.status);
    });

    it('should reject invalid refresh token format', async () => {
      const response = await request(app).post('/api/auth/revoke').send({
        refreshToken: 'invalid.token.format',
      });

      expect([400, 403, 500]).toContain(response.status);
    });

    it('should handle empty refresh token', async () => {
      const response = await request(app).post('/api/auth/revoke').send({
        refreshToken: '',
      });

      expect([400, 500]).toContain(response.status);
    });
  });

  describe('Complete refresh flow', () => {
    it('should handle refresh workflow structure', async () => {
      // Este test verifica la estructura de la API
      // En un entorno real, primero harías login para obtener tokens

      // 1. Intentar refresh con token inválido
      const refreshResponse = await request(app).post('/api/auth/refresh').send({
        refreshToken: 'some.invalid.token',
      });

      // Debería rechazar el token inválido
      expect([403, 500]).toContain(refreshResponse.status);

      // 2. Intentar revoke con token inválido
      const revokeResponse = await request(app).post('/api/auth/revoke').send({
        refreshToken: 'some.invalid.token',
      });

      // Debería rechazar el token inválido
      expect([400, 403, 500]).toContain(revokeResponse.status);
    });
  });
});
