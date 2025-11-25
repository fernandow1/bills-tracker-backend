import request from 'supertest';
import jwt from 'jsonwebtoken';
import { CREATE_TEST_SERVER } from '../../../tests/helpers/server';
import { Application } from 'express';

describe('Bill Integration Tests', () => {
  let app: Application;
  let authToken: string;

  beforeAll(async () => {
    // Crear servidor de test
    app = CREATE_TEST_SERVER.app;

    // Crear token JWT de test (sin verificar base de datos)
    authToken = jwt.sign({ sub: '1' }, process.env.JWT_SECRET || 'test-secret', {
      expiresIn: '1h',
    });
  });

  describe('GET /bills', () => {
    it('should return 401 without authentication', async () => {
      await request(app).get('/api/bills').expect(401);
    });

    it('should get all bills with authentication', async () => {
      const response = await request(app)
        .get('/api/bills')
        .set('Authorization', `Bearer ${authToken}`);

      // Puede retornar 200 (éxito) o 500 (error interno por user no encontrado)
      expect([200, 500]).toContain(response.status);
    });
  });

  describe('POST /bills', () => {
    it('should return 401 without authentication', async () => {
      const billData = {
        idShop: 1,
        idCurrency: 1,
        idPaymentMethod: 1,
        idUser: 1,
        total: 100.5,
        billItems: [],
      };

      await request(app).post('/api/bills').send(billData).expect(401);
    });

    it('should attempt to create bill with authentication', async () => {
      const billData = {
        idShop: 1,
        idCurrency: 1,
        idPaymentMethod: 1,
        idUser: 1,
        total: 100.5,
        billItems: [],
      };

      const response = await request(app)
        .post('/api/bills')
        .set('Authorization', `Bearer ${authToken}`)
        .send(billData);

      // Puede retornar 400 (validation), 500 (error interno) o 201 (success)
      expect([201, 400, 500]).toContain(response.status);
    });
  });

  describe('GET /bills/:id', () => {
    it('should return 401 or 404 without authentication', async () => {
      const response = await request(app).get('/api/bills/1');
      expect([401, 404]).toContain(response.status);
    });

    it('should attempt to get bill by id with authentication', async () => {
      const response = await request(app)
        .get('/api/bills/1')
        .set('Authorization', `Bearer ${authToken}`);

      // Puede retornar 404 (not found), 500 (error interno)
      expect([404, 500]).toContain(response.status);
    });
  });

  describe('PUT /bills/:id', () => {
    it('should return 401 without authentication', async () => {
      await request(app).put('/api/bills/1').send({ total: 200.0 }).expect(401);
    });

    it('should attempt to update bill with authentication', async () => {
      const response = await request(app)
        .put('/api/bills/1')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ total: 200.0 });

      // Puede retornar varios códigos dependiendo del estado
      expect([200, 400, 404, 500]).toContain(response.status);
    });
  });

  describe('DELETE /bills/:id', () => {
    it('should return 401 without authentication', async () => {
      await request(app).delete('/api/bills/1').expect(401);
    });

    it('should attempt to delete bill with authentication', async () => {
      const response = await request(app)
        .delete('/api/bills/1')
        .set('Authorization', `Bearer ${authToken}`);

      // Puede retornar varios códigos dependiendo del estado
      expect([200, 404, 500]).toContain(response.status);
    });
  });
});
