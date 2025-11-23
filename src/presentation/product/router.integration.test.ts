import supertest from 'supertest';
import { CREATE_TEST_SERVER } from '../../../tests/helpers/server';

describe('Product Router Integration Tests', () => {
  const request = supertest(CREATE_TEST_SERVER.app);

  describe('GET /api/products', () => {
    test('should retrieve all products (empty array when no data)', async () => {
      const response = await request.get('/api/products').expect(200);

      // Verificar que la respuesta sea un array
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toEqual([]); // BD limpia en cada test

      console.log(`✅ GET /api/products: Retrieved ${response.body.length} products`);
    });

    test('should return products with correct structure when data exists', async () => {
      // Primero necesitamos crear brand y category para el producto
      const brandData = { name: 'Test Brand for Product' };
      const brandResponse = await request.post('/api/brands').send(brandData).expect(201);
      const brandId = brandResponse.body.id;

      const categoryData = { name: 'Test Category for Product' };
      const categoryResponse = await request.post('/api/categories').send(categoryData).expect(201);
      const categoryId = categoryResponse.body.id;

      // Ahora crear un producto
      const productData = {
        idBrand: brandId,
        idCategory: categoryId,
        name: 'Test Product for GET',
        description: 'A test product for integration testing',
      };

      const createResponse = await request.post('/api/products').send(productData).expect(201);
      expect(createResponse.body).toHaveProperty('id');

      // Ahora obtener todos los productos
      const getResponse = await request.get('/api/products').expect(200);

      expect(getResponse.body).toBeInstanceOf(Array);
      expect(getResponse.body.length).toBeGreaterThan(0);

      // Verificar estructura del producto
      const product = getResponse.body[0];
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('idBrand');
      expect(product).toHaveProperty('idCategory');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('createdAt');
      expect(product).toHaveProperty('updatedAt');
      expect(product).toHaveProperty('deletedAt');

      console.log(`✅ GET /api/products with data: Retrieved ${getResponse.body.length} products`);
    });
  });

  describe('GET /api/products/:id', () => {
    test('should retrieve a specific product by ID', async () => {
      // Crear brand y category primero
      const brandData = { name: 'Test Brand for Single Product' };
      const brandResponse = await request.post('/api/brands').send(brandData).expect(201);
      const brandId = brandResponse.body.id;

      const categoryData = { name: 'Test Category for Single Product' };
      const categoryResponse = await request.post('/api/categories').send(categoryData).expect(201);
      const categoryId = categoryResponse.body.id;

      // Crear un producto
      const productData = {
        idBrand: brandId,
        idCategory: categoryId,
        name: 'Single Test Product',
        description: 'A single test product',
      };

      const createResponse = await request.post('/api/products').send(productData).expect(201);
      const productId = createResponse.body.id;

      // Obtener el producto por ID
      const getResponse = await request.get(`/api/products/${productId}`).expect(200);

      expect(getResponse.body).toHaveProperty('id', productId);
      expect(getResponse.body).toHaveProperty('name', productData.name);
      expect(getResponse.body).toHaveProperty('description', productData.description);
      expect(getResponse.body).toHaveProperty('idBrand', brandId);
      expect(getResponse.body).toHaveProperty('idCategory', categoryId);

      console.log(`✅ GET /api/products/${productId}: Retrieved product successfully`);
    });

    test('should return 500 when product does not exist', async () => {
      const nonExistentId = 99999;

      const response = await request.get(`/api/products/${nonExistentId}`).expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'INTERNAL_ERROR');

      console.log(`✅ GET /api/products/${nonExistentId}: Correctly handled non-existent product`);
    });
  });

  describe('POST /api/products', () => {
    let testBrandId: number;
    let testCategoryId: number;

    beforeEach(async () => {
      // Crear brand y category para cada test
      const brandData = { name: `Test Brand ${Date.now()}` };
      const brandResponse = await request.post('/api/brands').send(brandData).expect(201);
      testBrandId = brandResponse.body.id;

      const categoryData = { name: `Test Category ${Date.now()}` };
      const categoryResponse = await request.post('/api/categories').send(categoryData).expect(201);
      testCategoryId = categoryResponse.body.id;
    });

    test('should create a new product successfully', async () => {
      const productData = {
        idBrand: testBrandId,
        idCategory: testCategoryId,
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone with advanced features',
      };

      const response = await request.post('/api/products').send(productData).expect(201);

      // Verificar que retorna el producto creado
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(productData.name);
      expect(response.body.description).toBe(productData.description);
      expect(response.body.idBrand).toBe(productData.idBrand);
      expect(response.body.idCategory).toBe(productData.idCategory);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
      expect(response.body.deletedAt).toBeNull();

      console.log(`✅ POST /api/products: Created product with ID ${response.body.id}`);
    });

    test('should create product with null description', async () => {
      const productData = {
        idBrand: testBrandId,
        idCategory: testCategoryId,
        name: 'Product with null description',
        description: null,
      };

      const response = await request.post('/api/products').send(productData).expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(productData.name);
      expect(response.body.description).toBeNull();
      expect(response.body.idBrand).toBe(productData.idBrand);
      expect(response.body.idCategory).toBe(productData.idCategory);

      console.log(
        `✅ POST /api/products (null description): Created product with ID ${response.body.id}`,
      );
    });

    test('should create multiple products with different names', async () => {
      const productNames = ['Samsung Galaxy S24', 'Google Pixel 8', 'OnePlus 12'];
      const createdProducts = [];

      for (const name of productNames) {
        const productData = {
          idBrand: testBrandId,
          idCategory: testCategoryId,
          name,
          description: `Description for ${name}`,
        };
        const response = await request.post('/api/products').send(productData).expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(name);
        createdProducts.push(response.body);
      }

      expect(createdProducts).toHaveLength(3);
      console.log(`✅ POST /api/products (multiple): Created ${createdProducts.length} products`);
    });

    test('should return 400 when required fields are missing', async () => {
      const invalidProductData = {};

      const response = await request.post('/api/products').send(invalidProductData).expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
      expect(response.body.error).toHaveProperty('msg', 'Validation failed');
      expect(response.body.error).toHaveProperty('details');

      console.log(
        `✅ POST /api/products (invalid): Correctly rejected request without required fields`,
      );
    });

    test('should return 400 when name is empty', async () => {
      const invalidProductData = {
        idBrand: testBrandId,
        idCategory: testCategoryId,
        name: '',
        description: 'Test description',
      };

      const response = await request.post('/api/products').send(invalidProductData).expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
      expect(response.body.error).toHaveProperty('msg', 'Validation failed');

      console.log(`✅ POST /api/products (empty name): Correctly rejected request with empty name`);
    });

    test('should return 400 when idBrand is invalid', async () => {
      const invalidProductData = {
        idBrand: 'invalid',
        idCategory: testCategoryId,
        name: 'Test Product',
        description: 'Test description',
      };

      const response = await request.post('/api/products').send(invalidProductData).expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
      expect(response.body.error).toHaveProperty('msg', 'Validation failed');

      console.log(
        `✅ POST /api/products (invalid idBrand): Correctly rejected request with invalid idBrand`,
      );
    });

    test('should return 400 when idCategory is invalid', async () => {
      const invalidProductData = {
        idBrand: testBrandId,
        idCategory: 'invalid',
        name: 'Test Product',
        description: 'Test description',
      };

      const response = await request.post('/api/products').send(invalidProductData).expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
      expect(response.body.error).toHaveProperty('msg', 'Validation failed');

      console.log(
        `✅ POST /api/products (invalid idCategory): Correctly rejected request with invalid idCategory`,
      );
    });
  });

  describe('PUT /api/products/:id', () => {
    let testBrandId: number;
    let testCategoryId: number;
    let testProductId: number;

    beforeEach(async () => {
      // Crear brand y category para cada test
      const brandData = { name: `Test Brand Update ${Date.now()}` };
      const brandResponse = await request.post('/api/brands').send(brandData).expect(201);
      testBrandId = brandResponse.body.id;

      const categoryData = { name: `Test Category Update ${Date.now()}` };
      const categoryResponse = await request.post('/api/categories').send(categoryData).expect(201);
      testCategoryId = categoryResponse.body.id;

      // Crear un producto para actualizar
      const productData = {
        idBrand: testBrandId,
        idCategory: testCategoryId,
        name: 'Original Product Name',
        description: 'Original description',
      };
      const productResponse = await request.post('/api/products').send(productData).expect(201);
      testProductId = productResponse.body.id;
    });

    test('should update a product successfully', async () => {
      const updateData = {
        idBrand: testBrandId,
        idCategory: testCategoryId,
        name: 'Updated Product Name',
        description: 'Updated description',
      };

      const response = await request
        .put(`/api/products/${testProductId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.description).toBe(updateData.description);
      expect(response.body.idBrand).toBe(updateData.idBrand);
      expect(response.body.idCategory).toBe(updateData.idCategory);

      console.log(`✅ PUT /api/products/${testProductId}: Updated product successfully`);
    });

    test('should update product with new brand and category', async () => {
      // Crear nueva brand y category
      const newBrandData = { name: `New Brand ${Date.now()}` };
      const newBrandResponse = await request.post('/api/brands').send(newBrandData).expect(201);
      const newBrandId = newBrandResponse.body.id;

      const newCategoryData = { name: `New Category ${Date.now()}` };
      const newCategoryResponse = await request
        .post('/api/categories')
        .send(newCategoryData)
        .expect(201);
      const newCategoryId = newCategoryResponse.body.id;

      const updateData = {
        idBrand: newBrandId,
        idCategory: newCategoryId,
        name: 'Product with new brand and category',
        description: 'Updated with new relationships',
      };

      const response = await request
        .put(`/api/products/${testProductId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.idBrand).toBe(newBrandId);
      expect(response.body.idCategory).toBe(newCategoryId);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.description).toBe(updateData.description);

      console.log(
        `✅ PUT /api/products/${testProductId}: Updated product with new brand and category`,
      );
    });

    test('should return 400 when update data is invalid', async () => {
      const invalidUpdateData = {
        idBrand: 'invalid',
        idCategory: testCategoryId,
        name: 'Test Product',
        description: 'Test description',
      };

      const response = await request
        .put(`/api/products/${testProductId}`)
        .send(invalidUpdateData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
      expect(response.body.error).toHaveProperty('msg', 'Validation failed');

      console.log(`✅ PUT /api/products/${testProductId}: Correctly rejected invalid update data`);
    });

    test('should return 500 when product does not exist', async () => {
      const nonExistentId = 99999;
      const updateData = {
        idBrand: testBrandId,
        idCategory: testCategoryId,
        name: 'Updated Product',
        description: 'Updated description',
      };

      const response = await request
        .put(`/api/products/${nonExistentId}`)
        .send(updateData)
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'INTERNAL_ERROR');

      console.log(`✅ PUT /api/products/${nonExistentId}: Correctly handled non-existent product`);
    });
  });

  describe('DELETE /api/products/:id', () => {
    let testBrandId: number;
    let testCategoryId: number;
    let testProductId: number;

    beforeEach(async () => {
      // Crear brand y category para cada test
      const brandData = { name: `Test Brand Delete ${Date.now()}` };
      const brandResponse = await request.post('/api/brands').send(brandData).expect(201);
      testBrandId = brandResponse.body.id;

      const categoryData = { name: `Test Category Delete ${Date.now()}` };
      const categoryResponse = await request.post('/api/categories').send(categoryData).expect(201);
      testCategoryId = categoryResponse.body.id;

      // Crear un producto para eliminar
      const productData = {
        idBrand: testBrandId,
        idCategory: testCategoryId,
        name: 'Product to Delete',
        description: 'This product will be deleted',
      };
      const productResponse = await request.post('/api/products').send(productData).expect(201);
      testProductId = productResponse.body.id;
    });

    test('should delete a product successfully', async () => {
      const response = await request.delete(`/api/products/${testProductId}`).expect(204);

      // Verificar que no retorna contenido
      expect(response.body).toEqual({});

      // Verificar que el producto ya no existe (debería dar error al intentar obtenerlo)
      await request.get(`/api/products/${testProductId}`).expect(500);

      console.log(`✅ DELETE /api/products/${testProductId}: Deleted product successfully`);
    });

    test('should return 500 when trying to delete non-existent product', async () => {
      const nonExistentId = 99999;

      const response = await request.delete(`/api/products/${nonExistentId}`).expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'INTERNAL_ERROR');

      console.log(
        `✅ DELETE /api/products/${nonExistentId}: Correctly handled non-existent product`,
      );
    });

    test('should delete multiple products independently', async () => {
      // Crear varios productos
      const productsToDelete = [];
      for (let i = 0; i < 3; i++) {
        const productData = {
          idBrand: testBrandId,
          idCategory: testCategoryId,
          name: `Product to Delete ${i + 1}`,
          description: `Description ${i + 1}`,
        };
        const productResponse = await request.post('/api/products').send(productData).expect(201);
        productsToDelete.push(productResponse.body.id);
      }

      // Eliminar todos los productos
      for (const productId of productsToDelete) {
        await request.delete(`/api/products/${productId}`).expect(204);
      }

      // Verificar que todos fueron eliminados
      for (const productId of productsToDelete) {
        await request.get(`/api/products/${productId}`).expect(500);
      }

      console.log(
        `✅ DELETE multiple products: Deleted ${productsToDelete.length} products successfully`,
      );
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle invalid product ID format in GET', async () => {
      const invalidId = 'invalid-id';

      const response = await request.get(`/api/products/${invalidId}`).expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'INTERNAL_ERROR');

      console.log(`✅ GET /api/products/${invalidId}: Correctly handled invalid ID format`);
    });

    test('should handle invalid product ID format in PUT', async () => {
      const invalidId = 'invalid-id';
      const updateData = {
        idBrand: 1,
        idCategory: 1,
        name: 'Test Product',
        description: 'Test description',
      };

      const response = await request.put(`/api/products/${invalidId}`).send(updateData).expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'INTERNAL_ERROR');

      console.log(`✅ PUT /api/products/${invalidId}: Correctly handled invalid ID format`);
    });

    test('should handle invalid product ID format in DELETE', async () => {
      const invalidId = 'invalid-id';

      const response = await request.delete(`/api/products/${invalidId}`).expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'INTERNAL_ERROR');

      console.log(`✅ DELETE /api/products/${invalidId}: Correctly handled invalid ID format`);
    });
  });
});
