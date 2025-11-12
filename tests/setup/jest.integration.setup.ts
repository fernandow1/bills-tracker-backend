import { TestDataSource } from '../../src/infrastructure/database/connection-test';

// Setup global para todos los tests de integración
beforeAll(async () => {
  console.log('🔧 Initializing test database...');

  try {
    if (!TestDataSource.isInitialized) {
      await TestDataSource.initialize();
      console.log('✅ Test database connected successfully');
    }
  } catch (error) {
    console.error('❌ Failed to initialize test database:', error);
    throw error;
  }
}, 30000); // ✅ Timeout de 30s para la inicialización

// Cleanup global
afterAll(async () => {
  console.log('🧹 Cleaning up test database...');

  if (TestDataSource.isInitialized) {
    await TestDataSource.destroy();
    console.log('✅ Test database disconnected');
  }
});

// Limpiar datos entre tests (opcional)
afterEach(async () => {
  if (TestDataSource.isInitialized) {
    // Limpiar todas las tablas entre tests
    const entities = TestDataSource.entityMetadatas;

    // Deshabilitar foreign keys temporalmente
    await TestDataSource.query('SET FOREIGN_KEY_CHECKS = 0');

    // Limpiar cada tabla
    for (const entity of entities) {
      await TestDataSource.query(`TRUNCATE TABLE \`${entity.tableName}\``);
    }

    // Rehabilitar foreign keys
    await TestDataSource.query('SET FOREIGN_KEY_CHECKS = 1');
  }
});
