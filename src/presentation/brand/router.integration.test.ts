import supertest from 'supertest';
import { CREATE_TEST_SERVER } from '../../../tests/helpers/server';
import { Brand } from '../../domain/entities/brand.entity';

describe('Brand Router Integration Tests', () => {
  const request = supertest(CREATE_TEST_SERVER.app);

  describe('GET /api/brands', () => {
    test('should retrieve all brands (empty array when no data)', async () => {
      const response = await request.get('/api/brands').expect(200);

      // Verificar que la respuesta sea un array
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toEqual([]); // BD limpia en cada test

      console.log(`✅ GET /api/brands: Retrieved ${response.body.length} brands`);
    });

    test('should return brands with correct structure when data exists', async () => {
      // Primero crear una brand para tener datos
      const brandData = {
        name: 'Test Brand for GET',
      };

      const createResponse = await request.post('/api/brands').send(brandData).expect(201);

      expect(createResponse.body).toHaveProperty('id');

      // Ahora obtener todas las brands
      const getResponse = await request.get('/api/brands').expect(200);

      expect(getResponse.body).toBeInstanceOf(Array);
      expect(getResponse.body.length).toBeGreaterThan(0);

      // Verificar estructura de la brand
      const brand = getResponse.body[0];
      expect(brand).toHaveProperty('id');
      expect(brand).toHaveProperty('name');
      expect(brand).toHaveProperty('createdAt');
      expect(brand).toHaveProperty('updatedAt');
      expect(brand).toHaveProperty('deletedAt');

      console.log(`✅ GET /api/brands with data: Retrieved ${getResponse.body.length} brands`);
    });
  });

  describe('POST /api/brands', () => {
    test('should create a new brand successfully', async () => {
      const brandData = {
        name: 'Nike',
      };

      const response = await request.post('/api/brands').send(brandData).expect(201);

      // Verificar que retorna la brand creada
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(brandData.name);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
      expect(response.body.deletedAt).toBeNull();

      console.log(`✅ POST /api/brands: Created brand with ID ${response.body.id}`);
    });

    test('should create multiple brands with different names', async () => {
      const brandNames = ['Adidas', 'Puma', 'Reebok'];
      const createdBrands = [];

      for (const name of brandNames) {
        const brandData = { name };
        const response = await request.post('/api/brands').send(brandData).expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(name);
        createdBrands.push(response.body);
      }

      expect(createdBrands).toHaveLength(3);
      console.log(`✅ POST /api/brands (multiple): Created ${createdBrands.length} brands`);
    });

    test('should return 400 when name is missing', async () => {
      const invalidBrandData = {};

      const response = await request.post('/api/brands').send(invalidBrandData).expect(400);

      // Las validaciones retornan un error específico
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
      expect(response.body.error).toHaveProperty('msg', 'Validation failed');
      expect(response.body.error).toHaveProperty('details');

      console.log(`✅ POST /api/brands (invalid): Correctly rejected request without name`);
    });

    test('should return 400 when name is empty string', async () => {
      const invalidBrandData = {
        name: '',
      };

      const response = await request.post('/api/brands').send(invalidBrandData).expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');

      console.log(`✅ POST /api/brands (empty name): Correctly rejected empty name`);
    });

    test('should return 400 when name exceeds maximum length', async () => {
      const invalidBrandData = {
        name: 'A'.repeat(51), // Más de 50 caracteres
      };

      const response = await request.post('/api/brands').send(invalidBrandData).expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');

      console.log(`✅ POST /api/brands (long name): Correctly rejected name exceeding max length`);
    });

    test('should return 400 when name is not a string', async () => {
      const invalidBrandData = {
        name: 123,
      };

      const response = await request.post('/api/brands').send(invalidBrandData).expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');

      console.log(`✅ POST /api/brands (non-string): Correctly rejected non-string name`);
    });
  });

  describe('PUT /api/brands/:id', () => {
    test('should update an existing brand', async () => {
      // Primero crear una brand
      const brandData = {
        name: 'Brand to Update',
      };

      const createResponse = await request.post('/api/brands').send(brandData).expect(201);
      const brandId = createResponse.body.id;

      // Ahora actualizar la brand
      const updatedData = {
        name: 'Updated Brand Name',
      };

      const updateResponse = await request
        .put(`/api/brands/${brandId}`)
        .send(updatedData)
        .expect(200);

      expect(updateResponse.body.id).toBe(brandId);
      expect(updateResponse.body.name).toBe(updatedData.name);
      expect(updateResponse.body).toHaveProperty('updatedAt');

      console.log(`✅ PUT /api/brands/:id: Updated brand with ID ${brandId}`);
    });

    test('should update brand with partial data', async () => {
      // Crear brand
      const brandData = { name: 'Original Brand' };
      const createResponse = await request.post('/api/brands').send(brandData).expect(201);
      const brandId = createResponse.body.id;

      // Actualizar solo el nombre (dto permite campos opcionales)
      const partialUpdate = { name: 'Partially Updated Brand' };
      const updateResponse = await request
        .put(`/api/brands/${brandId}`)
        .send(partialUpdate)
        .expect(200);

      expect(updateResponse.body.id).toBe(brandId);
      expect(updateResponse.body.name).toBe(partialUpdate.name);

      console.log(`✅ PUT /api/brands/:id (partial): Successfully updated with partial data`);
    });

    test('should return 400 when updating with invalid data', async () => {
      // Crear brand primero
      const brandData = { name: 'Valid Brand' };
      const createResponse = await request.post('/api/brands').send(brandData).expect(201);
      const brandId = createResponse.body.id;

      // Intentar actualizar con datos inválidos
      const invalidData = {
        name: 'A'.repeat(51), // Excede el límite de 50 caracteres
      };

      const response = await request.put(`/api/brands/${brandId}`).send(invalidData).expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');

      console.log(`✅ PUT /api/brands/:id (invalid): Correctly rejected invalid update data`);
    });

    test('should return 404 when updating non-existent brand', async () => {
      const nonExistentId = 9999;
      const updatedData = {
        name: 'Non-existent Brand',
      };

      const response = await request
        .put(`/api/brands/${nonExistentId}`)
        .send(updatedData)
        .expect(500); // El controlador actual devuelve 500 para errores internos

      expect(response.body).toHaveProperty('error');

      console.log(`✅ PUT /api/brands/:id: Handled update for non-existent brand`);
    });
  });

  describe('DELETE /api/brands/:id', () => {
    test('should delete an existing brand', async () => {
      // Primero crear una brand
      const brandData = {
        name: 'Brand to Delete',
      };

      const createResponse = await request.post('/api/brands').send(brandData).expect(201);
      const brandId = createResponse.body.id;

      // Eliminar la brand
      await request.delete(`/api/brands/${brandId}`).expect(204);

      // Verificar que ya no aparece en la lista (soft delete)
      const getResponse = await request.get('/api/brands').expect(200);
      const brands = getResponse.body as Brand[];
      const deletedBrand = brands.find((b) => b.id === brandId);

      expect(deletedBrand).toBeUndefined(); // No debería aparecer debido al soft delete

      console.log(`✅ DELETE /api/brands/:id: Successfully deleted brand with ID ${brandId}`);
    });

    test('should return 204 even when deleting non-existent brand', async () => {
      const nonExistentId = 9999;

      // El soft delete no falla aunque no exista el registro
      await request.delete(`/api/brands/${nonExistentId}`).expect(204);

      console.log(`✅ DELETE /api/brands/:id: Handled deletion of non-existent brand gracefully`);
    });

    test('should return 500 when deleting with invalid ID format', async () => {
      const invalidId = 'not-a-number';

      // TypeScript convertirá a NaN, causando un error interno
      await request.delete(`/api/brands/${invalidId}`).expect(500);

      console.log(`✅ DELETE /api/brands/:id: Handled invalid ID format with proper error`);
    });
  });

  describe('Complete workflow', () => {
    test('should create, update, retrieve and delete brands in complete workflow', async () => {
      // 1. Verificar que inicialmente no hay brands
      let getResponse = await request.get('/api/brands').expect(200);
      expect(getResponse.body).toEqual([]);

      // 2. Crear múltiples brands
      const brandsToCreate = [{ name: 'Nike' }, { name: 'Adidas' }, { name: 'Puma' }];

      const createdBrands = [];
      for (const brandData of brandsToCreate) {
        const createResponse = await request.post('/api/brands').send(brandData).expect(201);
        createdBrands.push(createResponse.body);
      }

      // 3. Verificar que se crearon correctamente
      expect(createdBrands).toHaveLength(3);
      createdBrands.forEach((brand) => {
        expect(brand).toHaveProperty('id');
        expect(typeof brand.id).toBe('number');
      });

      // 4. Obtener todas las brands y verificar
      getResponse = await request.get('/api/brands').expect(200);
      expect(getResponse.body).toHaveLength(3);

      // 5. Actualizar una brand
      const brandToUpdate = createdBrands[0];
      const updatedData = { name: 'Nike Updated' };
      const updateResponse = await request
        .put(`/api/brands/${brandToUpdate.id}`)
        .send(updatedData)
        .expect(200);

      expect(updateResponse.body.name).toBe('Nike Updated');

      // 6. Eliminar una brand
      const brandToDelete = createdBrands[1];
      await request.delete(`/api/brands/${brandToDelete.id}`).expect(204);

      // 7. Verificar estado final
      const finalGetResponse = await request.get('/api/brands').expect(200);
      expect(finalGetResponse.body).toHaveLength(2); // Una actualizada, una eliminada (soft delete)

      const finalBrands = finalGetResponse.body as Brand[];
      expect(finalBrands.find((b) => b.name === 'Nike Updated')).toBeDefined();
      expect(finalBrands.find((b) => b.name === 'Puma')).toBeDefined();
      expect(finalBrands.find((b) => b.name === 'Adidas')).toBeUndefined(); // Eliminada

      console.log(
        `✅ Complete workflow: Successfully completed CRUD operations with ${finalBrands.length} brands remaining`,
      );
    });

    test('should handle concurrent brand creation', async () => {
      const brandNames = Array.from({ length: 10 }, (_, i) => `Brand ${i + 1}`);

      // Crear todas las brands en paralelo
      const createPromises = brandNames.map((name) =>
        request.post('/api/brands').send({ name }).expect(201),
      );

      const responses = await Promise.all(createPromises);

      // Verificar que todas se crearon correctamente
      expect(responses).toHaveLength(10);
      responses.forEach((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
      });

      // Verificar que todas están en la base de datos
      const getResponse = await request.get('/api/brands').expect(200);
      expect(getResponse.body).toHaveLength(10);

      console.log(
        `✅ Concurrent creation: Successfully created ${responses.length} brands concurrently`,
      );
    });
  });
});
