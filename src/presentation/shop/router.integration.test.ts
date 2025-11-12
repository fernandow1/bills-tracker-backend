import supertest from 'supertest';
import { CREATE_TEST_SERVER } from '../../../tests/helpers/server';
import { Shop } from '../../domain/entities/shop.entity';

describe('Shop Router Integration Tests', () => {
  const request = supertest(CREATE_TEST_SERVER.app);

  describe('GET /api/shops', () => {
    test('should retrieve all shops (empty array when no data)', async () => {
      const response = await request.get('/api/shops').expect(200);

      // Verificar que la respuesta sea un array
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toEqual([]); // BD limpia en cada test

      console.log(`✅ GET /api/shops: Retrieved ${response.body.length} shops`);
    });

    test('should return shops with correct structure when data exists', async () => {
      // Primero crear un shop para tener datos
      const shopData = {
        name: 'Test Shop for GET',
        description: 'A test shop created for integration testing',
        latitude: 40.7128,
        longitude: -74.006,
      };

      const createResponse = await request.post('/api/shops').send(shopData).expect(201);

      expect(createResponse.body).toHaveProperty('id');

      // Ahora obtener todos los shops
      const getResponse = await request.get('/api/shops').expect(200);

      expect(getResponse.body).toBeInstanceOf(Array);
      expect(getResponse.body.length).toBeGreaterThan(0);

      // Verificar estructura del shop
      const shop = getResponse.body[0];
      expect(shop).toHaveProperty('id');
      expect(shop).toHaveProperty('name');
      expect(shop).toHaveProperty('description');
      expect(shop).toHaveProperty('latitude');
      expect(shop).toHaveProperty('longitude');
      expect(shop).toHaveProperty('createdAt');
      expect(shop).toHaveProperty('updatedAt');

      console.log(`✅ GET /api/shops with data: Retrieved ${getResponse.body.length} shops`);
    });
  });

  describe('POST /api/shops', () => {
    test('should create a new shop with all fields', async () => {
      const shopData = {
        name: 'SuperMercado Central',
        description: 'Un supermercado en el centro de la ciudad',
        latitude: 40.7589,
        longitude: -73.9851,
      };

      const response = await request.post('/api/shops').send(shopData).expect(201);

      // Verificar que retorna el shop creado
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(shopData.name);
      expect(response.body.description).toBe(shopData.description);
      expect(response.body.latitude).toBe(shopData.latitude);
      expect(response.body.longitude).toBe(shopData.longitude);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');

      console.log(`✅ POST /api/shops: Created shop with ID ${response.body.id}`);
    });

    test('should create a shop with only required fields', async () => {
      const shopData = {
        name: 'Tienda Minima',
      };

      const response = await request.post('/api/shops').send(shopData).expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(shopData.name);
      expect(response.body.description).toBeNull();
      expect(response.body.latitude).toBeNull();
      expect(response.body.longitude).toBeNull();

      console.log(`✅ POST /api/shops (minimal): Created shop with ID ${response.body.id}`);
    });

    test('should return 400 when name is missing', async () => {
      const invalidShopData = {
        description: 'Shop sin nombre',
      };

      const response = await request.post('/api/shops').send(invalidShopData).expect(400);

      // Las validaciones retornan un array de errores
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors.length).toBeGreaterThan(0);
      console.log(`✅ POST /api/shops (invalid): Correctly rejected request without name`);
    });

    test('should return 400 when request body is empty', async () => {
      const response = await request.post('/api/shops').send({}).expect(400);

      // Las validaciones retornan un array de errores
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors.length).toBeGreaterThan(0);
      console.log(`✅ POST /api/shops (empty): Correctly rejected empty request`);
    });
  });

  describe('UPDATE /api/shops/:id', () => {
    test('should update an existing shop', async () => {
      // Primero crear un shop
      const shopData = {
        name: 'Shop to Update',
        description: 'Initial Description',
      };

      const createResponse = await request.post('/api/shops').send(shopData).expect(201);
      const shopId = createResponse.body.id;

      // Ahora actualizar el shop

      const updatedData = {
        name: 'Updated Shop Name',
        description: 'Updated Description',
        latitude: 51.5074,
        longitude: -0.1278,
      };

      const updateResponse = await request
        .put(`/api/shops/${shopId}`)
        .send(updatedData)
        .expect(200);

      expect(updateResponse.body.id).toBe(shopId);
      expect(updateResponse.body.name).toBe(updatedData.name);
      expect(updateResponse.body.description).toBe(updatedData.description);
      expect(updateResponse.body.latitude).toBe(updatedData.latitude);
      expect(updateResponse.body.longitude).toBe(updatedData.longitude);
      console.log(`✅ UPDATE /api/shops/:id: Updated shop with ID ${shopId}`);
    });

    test('should return 404 when updating non-existent shop', async () => {
      const nonExistentId = 9999;
      const updatedData = {
        name: 'Non-existent Shop',
      };

      const response = await request
        .put(`/api/shops/${nonExistentId}`)
        .send(updatedData)
        .expect(404);

      // Verificar estructura de error correcta
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
      expect(response.body.error).toHaveProperty('msg');
      expect(response.body.error.msg).toContain(`Shop with id ${nonExistentId} not found`);

      console.log(`✅ UPDATE /api/shops/:id: Correctly handled update for non-existent shop`);
    });
  });

  describe('Complete workflow', () => {
    test('should create and retrieve shops in complete workflow', async () => {
      // 1. Verificar que inicialmente no hay shops
      let getResponse = await request.get('/api/shops').expect(200);
      expect(getResponse.body).toEqual([]);

      // 2. Crear múltiples shops
      const shopsToCreate = [
        {
          name: 'Shop 1',
          description: 'First shop',
          latitude: 10.0,
          longitude: 20.0,
        },
        {
          name: 'Shop 2',
          description: 'Second shop',
          latitude: 30.0,
          longitude: 40.0,
        },
        {
          name: 'Shop 3', // Solo nombre
        },
      ];

      const createdShops = [];
      for (const shopData of shopsToCreate) {
        const createResponse = await request.post('/api/shops').send(shopData).expect(201);
        createdShops.push(createResponse.body);
      }

      // 3. Verificar que se crearon correctamente
      expect(createdShops).toHaveLength(3);
      createdShops.forEach((shop) => {
        expect(shop).toHaveProperty('id');
        expect(typeof shop.id).toBe('number');
      });

      // 4. Obtener todos los shops y verificar
      getResponse = await request.get('/api/shops').expect(200);
      expect(getResponse.body).toHaveLength(3);

      // 5. Verificar que los datos persisten correctamente
      const retrievedShops = getResponse.body as Shop[];
      expect(retrievedShops.find((s) => s.name === 'Shop 1')).toBeDefined();
      expect(retrievedShops.find((s) => s.name === 'Shop 2')).toBeDefined();
      expect(retrievedShops.find((s) => s.name === 'Shop 3')).toBeDefined();

      console.log(
        `✅ Complete workflow: Created and retrieved ${retrievedShops.length} shops successfully`,
      );
    });
  });
});
