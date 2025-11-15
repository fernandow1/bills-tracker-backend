import supertest from 'supertest';
import { CREATE_TEST_SERVER } from '../../../tests/helpers/server';
import { Currency } from '../../domain/entities/currency.entity';

describe('Currency Router Integration Tests', () => {
  const request = supertest(CREATE_TEST_SERVER.app);

  describe('GET /api/currencies', () => {
    test('should retrieve all currencies (empty array when no data)', async () => {
      const response = await request.get('/api/currencies').expect(200);

      // Verificar que la respuesta sea un array
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toEqual([]); // BD limpia en cada test

      console.log(`✅ GET /api/currencies: Retrieved ${response.body.length} currencies`);
    });

    test('should return currencies with correct structure when data exists', async () => {
      // Primero crear una currency para tener datos
      const currencyData = {
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
      };

      const createResponse = await request.post('/api/currencies').send(currencyData).expect(201);

      expect(createResponse.body).toHaveProperty('id');

      // Ahora obtener todas las currencies
      const getResponse = await request.get('/api/currencies').expect(200);

      expect(getResponse.body).toBeInstanceOf(Array);
      expect(getResponse.body.length).toBeGreaterThan(0);

      // Verificar estructura de la currency
      const currency = getResponse.body[0];
      expect(currency).toHaveProperty('id');
      expect(currency).toHaveProperty('code');
      expect(currency).toHaveProperty('name');
      expect(currency).toHaveProperty('symbol');
      expect(currency).toHaveProperty('createdAt');
      expect(currency).toHaveProperty('updatedAt');

      console.log(
        `✅ GET /api/currencies with data: Retrieved ${getResponse.body.length} currencies`,
      );
    });
  });

  describe('POST /api/currencies', () => {
    test('should create a new currency with all fields', async () => {
      const currencyData = {
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
      };

      const response = await request.post('/api/currencies').send(currencyData).expect(201);

      // Verificar que retorna la currency creada
      expect(response.body).toHaveProperty('id');
      expect(response.body.code).toBe(currencyData.code);
      expect(response.body.name).toBe(currencyData.name);
      expect(response.body.symbol).toBe(currencyData.symbol);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
      expect(response.body.deletedAt).toBeNull();

      console.log(`✅ POST /api/currencies: Created currency with ID ${response.body.id}`);
    });

    test('should create currency with minimal required fields', async () => {
      const currencyData = {
        code: 'JPY',
        name: 'Japanese Yen',
        symbol: '¥',
      };

      const response = await request.post('/api/currencies').send(currencyData).expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.code).toBe(currencyData.code);
      expect(response.body.name).toBe(currencyData.name);
      expect(response.body.symbol).toBe(currencyData.symbol);

      console.log(`✅ POST /api/currencies: Created currency with ID ${response.body.id}`);
    });

    test('should return 400 when required fields are missing', async () => {
      const invalidCurrencyData = {
        name: 'Currency without code',
      };

      const response = await request.post('/api/currencies').send(invalidCurrencyData).expect(400);

      // Las validaciones retornan un array de errores
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors.length).toBeGreaterThan(0);

      console.log(
        `✅ POST /api/currencies validation: Caught ${response.body.errors.length} validation errors`,
      );
    });

    test('should return 400 when code is empty', async () => {
      const invalidCurrencyData = {
        code: '',
        name: 'Invalid Currency',
        symbol: 'X',
      };

      const response = await request.post('/api/currencies').send(invalidCurrencyData).expect(400);

      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toBeInstanceOf(Array);

      console.log(`✅ POST /api/currencies empty code: Validation working correctly`);
    });
  });

  describe('PUT /api/currencies/:id', () => {
    let currencyId: number;

    beforeEach(async () => {
      // Crear una currency antes de cada test de actualización
      const currencyData = {
        code: 'GBP',
        name: 'British Pound',
        symbol: '£',
      };

      const createResponse = await request.post('/api/currencies').send(currencyData).expect(201);

      currencyId = createResponse.body.id;
    });

    test('should update currency successfully', async () => {
      const updateData = {
        name: 'British Pound Sterling',
        symbol: '£',
      };

      const response = await request
        .put(`/api/currencies/${currencyId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('id', currencyId);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.symbol).toBe(updateData.symbol);
      expect(response.body.code).toBe('GBP'); // No cambió

      console.log(`✅ PUT /api/currencies/${currencyId}: Updated currency successfully`);
    });

    test('should return 404 when currency does not exist', async () => {
      const nonExistentId = 99999;
      const updateData = {
        name: 'Non-existent Currency',
      };

      const response = await request
        .put(`/api/currencies/${nonExistentId}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('msg');
      expect(response.body.error.msg).toContain('not found');

      console.log(`✅ PUT /api/currencies/${nonExistentId}: Correctly returned 404`);
    });

    test('should update currency with partial data', async () => {
      const updateData = {
        name: 'Updated Pound Name Only',
      };

      const response = await request
        .put(`/api/currencies/${currencyId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('id', currencyId);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.code).toBe('GBP'); // Original value preserved
      expect(response.body.symbol).toBe('£'); // Original value preserved

      console.log(`✅ PUT /api/currencies/${currencyId}: Partial update successful`);
    });
  });

  describe('DELETE /api/currencies/:id', () => {
    let currencyId: number;

    beforeEach(async () => {
      // Crear una currency antes de cada test de eliminación
      const currencyData = {
        code: 'CAD',
        name: 'Canadian Dollar',
        symbol: 'C$',
      };

      const createResponse = await request.post('/api/currencies').send(currencyData).expect(201);

      currencyId = createResponse.body.id;
    });

    test('should delete currency successfully', async () => {
      const response = await request.delete(`/api/currencies/${currencyId}`).expect(204);

      // 204 No Content no debe tener body
      expect(response.body).toEqual({});

      console.log(`✅ DELETE /api/currencies/${currencyId}: Deleted currency successfully`);
    });

    test('should return 204 even when currency does not exist (idempotent)', async () => {
      const nonExistentId = 99999;

      const response = await request.delete(`/api/currencies/${nonExistentId}`).expect(204);

      // DELETE debería ser idempotente - retorna 204 incluso si no existe
      expect(response.body).toEqual({});

      console.log(
        `✅ DELETE /api/currencies/${nonExistentId}: Correctly returned 204 (idempotent behavior)`,
      );
    });

    test('should not be able to get deleted currency', async () => {
      // Primero eliminar
      await request.delete(`/api/currencies/${currencyId}`).expect(204);

      // Intentar obtener todas las currencies - no debe incluir la eliminada
      const getResponse = await request.get('/api/currencies').expect(200);

      // La currency eliminada no debe aparecer en la lista
      const deletedCurrency = getResponse.body.find(
        (currency: Currency) => currency.id === currencyId,
      );
      expect(deletedCurrency).toBeUndefined();

      console.log(
        `✅ DELETE verification: Currency ${currencyId} not in GET response after deletion`,
      );
    });
  });
});
