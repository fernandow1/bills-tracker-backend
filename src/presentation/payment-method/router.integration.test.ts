import supertest from 'supertest';
import { CREATE_TEST_SERVER } from '../../../tests/helpers/server';
import { PaymentMethod } from '../../domain/entities/payment-method.entity';

describe('PaymentMethod Router Integration Tests', () => {
  const request = supertest(CREATE_TEST_SERVER.app);

  describe('GET /api/payment-methods', () => {
    test('should retrieve all payment methods (empty array when no data)', async () => {
      const response = await request.get('/api/payment-methods').expect(200);

      // Verificar que la respuesta sea un array
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toEqual([]); // BD limpia en cada test

      console.log(`✅ GET /api/payment-methods: Retrieved ${response.body.length} payment methods`);
    });

    test('should return payment methods with correct structure when data exists', async () => {
      // Primero crear un payment method para tener datos
      const paymentMethodData = {
        name: 'Credit Card',
        description: 'Payment via credit card',
      };

      const createResponse = await request
        .post('/api/payment-methods')
        .send(paymentMethodData)
        .expect(201);

      expect(createResponse.body).toHaveProperty('id');

      // Ahora obtener todos los payment methods
      const getResponse = await request.get('/api/payment-methods').expect(200);

      expect(getResponse.body).toBeInstanceOf(Array);
      expect(getResponse.body.length).toBeGreaterThan(0);

      // Verificar estructura del payment method
      const paymentMethod = getResponse.body[0];
      expect(paymentMethod).toHaveProperty('id');
      expect(paymentMethod).toHaveProperty('name');
      expect(paymentMethod).toHaveProperty('description');
      expect(paymentMethod).toHaveProperty('createdAt');
      expect(paymentMethod).toHaveProperty('updatedAt');

      console.log(
        `✅ GET /api/payment-methods with data: Retrieved ${getResponse.body.length} payment methods`,
      );
    });
  });

  describe('POST /api/payment-methods', () => {
    test('should create a new payment method with all fields', async () => {
      const paymentMethodData = {
        name: 'Debit Card',
        description: 'Payment via debit card',
      };

      const response = await request
        .post('/api/payment-methods')
        .send(paymentMethodData)
        .expect(201);

      // Verificar que retorna el payment method creado
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(paymentMethodData.name);
      expect(response.body.description).toBe(paymentMethodData.description);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
      expect(response.body.deletedAt).toBeNull();

      console.log(
        `✅ POST /api/payment-methods: Created payment method with ID ${response.body.id}`,
      );
    });

    test('should create payment method with minimal required fields', async () => {
      const paymentMethodData = {
        name: 'Cash',
        description: 'Cash payment',
      };

      const response = await request
        .post('/api/payment-methods')
        .send(paymentMethodData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(paymentMethodData.name);
      expect(response.body.description).toBe(paymentMethodData.description);

      console.log(
        `✅ POST /api/payment-methods: Created payment method with ID ${response.body.id}`,
      );
    });

    test('should return 400 when required fields are missing', async () => {
      const invalidPaymentMethodData = {
        description: 'Payment method without name',
      };

      const response = await request
        .post('/api/payment-methods')
        .send(invalidPaymentMethodData)
        .expect(400);

      // Las validaciones retornan un objeto error con detalles
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('msg');
      expect(response.body.error).toHaveProperty('details');
      expect(response.body.error.msg).toBe('Validation failed');

      console.log(`✅ POST /api/payment-methods validation: Validation error handled correctly`);
    });

    test('should return 400 when name is empty', async () => {
      const invalidPaymentMethodData = {
        name: '',
        description: 'Invalid payment method',
      };

      const response = await request
        .post('/api/payment-methods')
        .send(invalidPaymentMethodData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('msg');
      expect(response.body.error.msg).toBe('Validation failed');

      console.log(`✅ POST /api/payment-methods empty name: Validation working correctly`);
    });
  });

  describe('PUT /api/payment-methods/:id', () => {
    let paymentMethodId: number;

    beforeEach(async () => {
      // Crear un payment method antes de cada test de actualización
      const paymentMethodData = {
        name: 'Bank Transfer',
        description: 'Payment via bank transfer',
      };

      const createResponse = await request
        .post('/api/payment-methods')
        .send(paymentMethodData)
        .expect(201);

      paymentMethodId = createResponse.body.id;
    });

    test('should update payment method successfully', async () => {
      const updateData = {
        name: 'Wire Transfer',
        description: 'Payment via wire transfer',
      };

      const response = await request
        .put(`/api/payment-methods/${paymentMethodId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('id', paymentMethodId);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.description).toBe(updateData.description);

      console.log(
        `✅ PUT /api/payment-methods/${paymentMethodId}: Updated payment method successfully`,
      );
    });

    test('should return 404 when payment method does not exist', async () => {
      const nonExistentId = 99999;
      const updateData = {
        name: 'Non-existent Payment Method',
      };

      const response = await request
        .put(`/api/payment-methods/${nonExistentId}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('msg');
      expect(response.body.error.msg).toContain('not found');

      console.log(`✅ PUT /api/payment-methods/${nonExistentId}: Correctly returned 404`);
    });

    test('should update payment method with partial data', async () => {
      const updateData = {
        name: 'Updated Payment Method Name Only',
      };

      const response = await request
        .put(`/api/payment-methods/${paymentMethodId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('id', paymentMethodId);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.description).toBe('Payment via bank transfer'); // Original value preserved

      console.log(`✅ PUT /api/payment-methods/${paymentMethodId}: Partial update successful`);
    });
  });

  describe('DELETE /api/payment-methods/:id', () => {
    let paymentMethodId: number;

    beforeEach(async () => {
      // Crear un payment method antes de cada test de eliminación
      const paymentMethodData = {
        name: 'PayPal',
        description: 'Payment via PayPal',
      };

      const createResponse = await request
        .post('/api/payment-methods')
        .send(paymentMethodData)
        .expect(201);

      paymentMethodId = createResponse.body.id;
    });

    test('should delete payment method successfully', async () => {
      const response = await request.delete(`/api/payment-methods/${paymentMethodId}`).expect(204);

      // 204 No Content no debe tener body
      expect(response.body).toEqual({});

      console.log(
        `✅ DELETE /api/payment-methods/${paymentMethodId}: Deleted payment method successfully`,
      );
    });

    test('should return 204 even when payment method does not exist (idempotent)', async () => {
      const nonExistentId = 99999;

      const response = await request.delete(`/api/payment-methods/${nonExistentId}`).expect(204);

      // DELETE debería ser idempotente - retorna 204 incluso si no existe
      expect(response.body).toEqual({});

      console.log(
        `✅ DELETE /api/payment-methods/${nonExistentId}: Correctly returned 204 (idempotent behavior)`,
      );
    });

    test('should not be able to get deleted payment method', async () => {
      // Primero eliminar
      await request.delete(`/api/payment-methods/${paymentMethodId}`).expect(204);

      // Intentar obtener todos los payment methods - no debe incluir el eliminado
      const getResponse = await request.get('/api/payment-methods').expect(200);

      // El payment method eliminado no debe aparecer en la lista
      const deletedPaymentMethod = getResponse.body.find(
        (paymentMethod: PaymentMethod) => paymentMethod.id === paymentMethodId,
      );
      expect(deletedPaymentMethod).toBeUndefined();

      console.log(
        `✅ DELETE verification: Payment method ${paymentMethodId} not in GET response after deletion`,
      );
    });
  });
});
