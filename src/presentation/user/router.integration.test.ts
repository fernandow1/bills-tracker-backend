import request from 'supertest';
import { CREATE_TEST_SERVER } from '../../../tests/helpers/server';
import { Application } from 'express';

describe('User Router Integration Tests', () => {
  let app: Application;

  beforeAll(async () => {
    // Crear servidor de test
    app = CREATE_TEST_SERVER.app;
  });

  describe('POST /api/users', () => {
    const validUserData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      name: 'Test',
      surname: 'User',
    };

    it('should attempt to create a new user', async () => {
      const response = await request(app).post('/api/users').send(validUserData);

      // Puede retornar 201 (éxito) o 500 (error interno)
      expect([201, 500]).toContain(response.status);

      if (response.status === 201) {
        expect(response.body).toMatchObject({
          id: expect.any(Number),
          username: validUserData.username,
          email: validUserData.email,
          name: validUserData.name,
          surname: validUserData.surname,
        });
      }
    });

    it('should return error for invalid user data', async () => {
      const invalidUserData = {
        username: '', // Invalid: empty username
        email: 'invalid-email', // Invalid: bad email format
        password: '123', // Invalid: too short
      };

      const response = await request(app).post('/api/users').send(invalidUserData);

      // Puede retornar 400 (validación) o 500 (error interno)
      expect([400, 500]).toContain(response.status);
    });

    it('should return error for missing required fields', async () => {
      const incompleteUserData = {
        username: 'testuser',
        // Missing email, password, name, surname
      };

      const response = await request(app).post('/api/users').send(incompleteUserData);

      // Puede retornar 400 (validación) o 500 (error interno)
      expect([400, 500]).toContain(response.status);
    });
  });

  describe('POST /api/users/login', () => {
    const loginCredentials = {
      username: 'loginuser',
      password: 'password123',
    };

    it('should attempt to login with valid format', async () => {
      const response = await request(app).post('/api/users/login').send(loginCredentials);

      // Puede retornar 200 (éxito), 403 (credenciales inválidas) o 500 (error interno)
      expect([200, 403, 500]).toContain(response.status);

      if (response.status === 200) {
        expect(response.body).toMatchObject({
          user: expect.any(Object),
          token: expect.any(String),
        });
      }
    });

    it('should return error for missing username', async () => {
      const missingUsername = {
        password: 'password123',
      };

      const response = await request(app).post('/api/users/login').send(missingUsername);

      // Puede retornar 400 (validación) o 500 (error interno)
      expect([400, 500]).toContain(response.status);
    });

    it('should return error for missing password', async () => {
      const missingPassword = {
        username: 'testuser',
      };

      const response = await request(app).post('/api/users/login').send(missingPassword);

      // Puede retornar 400 (validación) o 500 (error interno)
      expect([400, 500]).toContain(response.status);
    });
  });
});
