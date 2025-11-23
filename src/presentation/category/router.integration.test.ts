import supertest from 'supertest';
import { CREATE_TEST_SERVER } from '../../../tests/helpers/server';
import { Category } from '../../domain/entities/category.entity';

describe('Category Router Integration Tests', () => {
  const request = supertest(CREATE_TEST_SERVER.app);

  describe('GET /api/categories', () => {
    test('should retrieve all categories (empty array when no data)', async () => {
      const response = await request.get('/api/categories').expect(200);

      // Verificar que la respuesta sea un array
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toEqual([]); // BD limpia en cada test

      console.log(`✅ GET /api/categories: Retrieved ${response.body.length} categories`);
    });

    test('should return categories with correct structure when data exists', async () => {
      // Primero crear una categoria para tener datos
      const categoryData = {
        name: 'Test Category for GET',
      };

      const createResponse = await request.post('/api/categories').send(categoryData).expect(201);

      expect(createResponse.body).toHaveProperty('id');

      // Ahora obtener todas las categorias
      const getResponse = await request.get('/api/categories').expect(200);

      expect(getResponse.body).toBeInstanceOf(Array);
      expect(getResponse.body.length).toBeGreaterThan(0);

      // Verificar estructura de la categoria
      const category = getResponse.body[0];
      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('createdAt');
      expect(category).toHaveProperty('updatedAt');
      expect(category).toHaveProperty('deletedAt');

      console.log(
        `✅ GET /api/categories with data: Retrieved ${getResponse.body.length} categories`,
      );
    });
  });

  describe('POST /api/categories', () => {
    test('should create a new category successfully', async () => {
      const categoryData = {
        name: 'Electronics',
      };

      const response = await request.post('/api/categories').send(categoryData).expect(201);

      // Verificar que retorna la categoria creada
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(categoryData.name);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
      expect(response.body.deletedAt).toBeNull();

      console.log(`✅ POST /api/categories: Created category with ID ${response.body.id}`);
    });

    test('should create multiple categories with different names', async () => {
      const categoryNames = ['Food & Beverages', 'Clothing', 'Home & Garden'];
      const createdCategories = [];

      for (const name of categoryNames) {
        const categoryData = { name };
        const response = await request.post('/api/categories').send(categoryData).expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(name);
        createdCategories.push(response.body);
      }

      expect(createdCategories).toHaveLength(3);
      console.log(
        `✅ POST /api/categories (multiple): Created ${createdCategories.length} categories`,
      );
    });

    test('should return 400 when name is missing', async () => {
      const invalidCategoryData = {};

      const response = await request.post('/api/categories').send(invalidCategoryData).expect(400);

      // Las validaciones retornan un error específico
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
      expect(response.body.error).toHaveProperty('msg', 'Validation failed');
      expect(response.body.error).toHaveProperty('details');

      console.log(`✅ POST /api/categories (invalid): Correctly rejected request without name`);
    });

    test('should return 400 when name is empty string', async () => {
      const invalidCategoryData = {
        name: '',
      };

      const response = await request.post('/api/categories').send(invalidCategoryData).expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');

      console.log(`✅ POST /api/categories (empty name): Correctly rejected empty name`);
    });

    test('should return 400 when name exceeds maximum length', async () => {
      const invalidCategoryData = {
        name: 'A'.repeat(101), // Más de 100 caracteres
      };

      const response = await request.post('/api/categories').send(invalidCategoryData).expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');

      console.log(
        `✅ POST /api/categories (long name): Correctly rejected name exceeding max length`,
      );
    });

    test('should return 400 when name is not a string', async () => {
      const invalidCategoryData = {
        name: 123,
      };

      const response = await request.post('/api/categories').send(invalidCategoryData).expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');

      console.log(`✅ POST /api/categories (non-string): Correctly rejected non-string name`);
    });
  });

  describe('PUT /api/categories/:id', () => {
    test('should update an existing category', async () => {
      // Primero crear una categoria
      const categoryData = {
        name: 'Category to Update',
      };

      const createResponse = await request.post('/api/categories').send(categoryData).expect(201);
      const categoryId = createResponse.body.id;

      // Ahora actualizar la categoria
      const updatedData = {
        name: 'Updated Category Name',
      };

      const updateResponse = await request
        .put(`/api/categories/${categoryId}`)
        .send(updatedData)
        .expect(200);

      expect(updateResponse.body.id).toBe(categoryId);
      expect(updateResponse.body.name).toBe(updatedData.name);
      expect(updateResponse.body).toHaveProperty('updatedAt');

      console.log(`✅ PUT /api/categories/:id: Updated category with ID ${categoryId}`);
    });

    test('should update category with partial data', async () => {
      // Crear categoria
      const categoryData = { name: 'Original Category' };
      const createResponse = await request.post('/api/categories').send(categoryData).expect(201);
      const categoryId = createResponse.body.id;

      // Actualizar solo el nombre (dto permite campos opcionales)
      const partialUpdate = { name: 'Partially Updated Category' };
      const updateResponse = await request
        .put(`/api/categories/${categoryId}`)
        .send(partialUpdate)
        .expect(200);

      expect(updateResponse.body.id).toBe(categoryId);
      expect(updateResponse.body.name).toBe(partialUpdate.name);

      console.log(`✅ PUT /api/categories/:id (partial): Successfully updated with partial data`);
    });

    test('should return 400 when updating with invalid data', async () => {
      // Crear categoria primero
      const categoryData = { name: 'Valid Category' };
      const createResponse = await request.post('/api/categories').send(categoryData).expect(201);
      const categoryId = createResponse.body.id;

      // Intentar actualizar con datos inválidos
      const invalidData = {
        name: 'A'.repeat(101), // Excede el límite de 100 caracteres
      };

      const response = await request
        .put(`/api/categories/${categoryId}`)
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');

      console.log(`✅ PUT /api/categories/:id (invalid): Correctly rejected invalid update data`);
    });

    test('should return 500 when updating non-existent category', async () => {
      const nonExistentId = 9999;
      const updatedData = {
        name: 'Non-existent Category',
      };

      const response = await request
        .put(`/api/categories/${nonExistentId}`)
        .send(updatedData)
        .expect(500); // El controlador actual devuelve 500 para errores internos

      expect(response.body).toHaveProperty('error');

      console.log(`✅ PUT /api/categories/:id: Handled update for non-existent category`);
    });
  });

  describe('DELETE /api/categories/:id', () => {
    test('should delete an existing category', async () => {
      // Primero crear una categoria
      const categoryData = {
        name: 'Category to Delete',
      };

      const createResponse = await request.post('/api/categories').send(categoryData).expect(201);
      const categoryId = createResponse.body.id;

      // Eliminar la categoria
      await request.delete(`/api/categories/${categoryId}`).expect(204);

      // Verificar que ya no aparece en la lista (soft delete)
      const getResponse = await request.get('/api/categories').expect(200);
      const categories = getResponse.body as Category[];
      const deletedCategory = categories.find((c) => c.id === categoryId);

      expect(deletedCategory).toBeUndefined(); // No debería aparecer debido al soft delete

      console.log(
        `✅ DELETE /api/categories/:id: Successfully deleted category with ID ${categoryId}`,
      );
    });

    test('should return 204 even when deleting non-existent category', async () => {
      const nonExistentId = 9999;

      // El soft delete no falla aunque no exista el registro
      await request.delete(`/api/categories/${nonExistentId}`).expect(204);

      console.log(
        `✅ DELETE /api/categories/:id: Handled deletion of non-existent category gracefully`,
      );
    });

    test('should return 500 when deleting with invalid ID format', async () => {
      const invalidId = 'not-a-number';

      // TypeScript convertirá a NaN, causando un error interno
      await request.delete(`/api/categories/${invalidId}`).expect(500);

      console.log(`✅ DELETE /api/categories/:id: Handled invalid ID format with proper error`);
    });
  });

  describe('Complete workflow', () => {
    test('should create, update, retrieve and delete categories in complete workflow', async () => {
      // 1. Verificar que inicialmente no hay categorias
      let getResponse = await request.get('/api/categories').expect(200);
      expect(getResponse.body).toEqual([]);

      // 2. Crear múltiples categorias
      const categoriesToCreate = [{ name: 'Electronics' }, { name: 'Clothing' }, { name: 'Books' }];

      const createdCategories = [];
      for (const categoryData of categoriesToCreate) {
        const createResponse = await request.post('/api/categories').send(categoryData).expect(201);
        createdCategories.push(createResponse.body);
      }

      // 3. Verificar que se crearon correctamente
      expect(createdCategories).toHaveLength(3);
      createdCategories.forEach((category) => {
        expect(category).toHaveProperty('id');
        expect(typeof category.id).toBe('number');
      });

      // 4. Obtener todas las categorias y verificar
      getResponse = await request.get('/api/categories').expect(200);
      expect(getResponse.body).toHaveLength(3);

      // 5. Actualizar una categoria
      const categoryToUpdate = createdCategories[0];
      const updatedData = { name: 'Electronics Updated' };
      const updateResponse = await request
        .put(`/api/categories/${categoryToUpdate.id}`)
        .send(updatedData)
        .expect(200);

      expect(updateResponse.body.name).toBe('Electronics Updated');

      // 6. Eliminar una categoria
      const categoryToDelete = createdCategories[1];
      await request.delete(`/api/categories/${categoryToDelete.id}`).expect(204);

      // 7. Verificar estado final
      const finalGetResponse = await request.get('/api/categories').expect(200);
      expect(finalGetResponse.body).toHaveLength(2); // Una actualizada, una eliminada (soft delete)

      const finalCategories = finalGetResponse.body as Category[];
      expect(finalCategories.find((c) => c.name === 'Electronics Updated')).toBeDefined();
      expect(finalCategories.find((c) => c.name === 'Books')).toBeDefined();
      expect(finalCategories.find((c) => c.name === 'Clothing')).toBeUndefined(); // Eliminada

      console.log(
        `✅ Complete workflow: Successfully completed CRUD operations with ${finalCategories.length} categories remaining`,
      );
    });

    test('should handle concurrent category creation', async () => {
      const categoryNames = Array.from({ length: 10 }, (_, i) => `Category ${i + 1}`);

      // Crear todas las categorias en paralelo
      const createPromises = categoryNames.map((name) =>
        request.post('/api/categories').send({ name }).expect(201),
      );

      const responses = await Promise.all(createPromises);

      // Verificar que todas se crearon correctamente
      expect(responses).toHaveLength(10);
      responses.forEach((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
      });

      // Verificar que todas están en la base de datos
      const getResponse = await request.get('/api/categories').expect(200);
      expect(getResponse.body).toHaveLength(10);

      console.log(
        `✅ Concurrent creation: Successfully created ${responses.length} categories concurrently`,
      );
    });
  });

  describe('Business rules and edge cases', () => {
    test('should handle category names with special characters', async () => {
      const specialNames = ['Food & Beverages', 'Home/Garden', 'Toys & Games', 'Health & Beauty'];

      for (const name of specialNames) {
        const response = await request.post('/api/categories').send({ name }).expect(201);
        expect(response.body.name).toBe(name);
      }

      const getResponse = await request.get('/api/categories').expect(200);
      expect(getResponse.body).toHaveLength(4);

      console.log(`✅ Special characters: Successfully created categories with special characters`);
    });

    test('should handle category names with unicode characters', async () => {
      const unicodeNames = ['Electrónicos', 'Niños', 'Café & Té', 'Artículos de Oficina'];

      for (const name of unicodeNames) {
        const response = await request.post('/api/categories').send({ name }).expect(201);
        expect(response.body.name).toBe(name);
      }

      const getResponse = await request.get('/api/categories').expect(200);
      expect(getResponse.body).toHaveLength(4);

      console.log(`✅ Unicode characters: Successfully created categories with unicode characters`);
    });

    test('should handle maximum length category names', async () => {
      // Crear categoria con exactamente 100 caracteres (límite máximo)
      const maxLengthName = 'A'.repeat(100);

      const response = await request
        .post('/api/categories')
        .send({ name: maxLengthName })
        .expect(201);
      expect(response.body.name).toBe(maxLengthName);
      expect(response.body.name).toHaveLength(100);

      console.log(
        `✅ Max length: Successfully created category with maximum allowed length (100 chars)`,
      );
    });

    test('should preserve whitespace in category names', async () => {
      const nameWithSpaces = '  Category with spaces  ';

      const response = await request
        .post('/api/categories')
        .send({ name: nameWithSpaces })
        .expect(201);
      expect(response.body.name).toBe(nameWithSpaces);

      console.log(`✅ Whitespace: Successfully preserved whitespace in category name`);
    });
  });
});
