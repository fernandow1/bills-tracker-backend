import { TestDataSource } from '../../src/infrastructure/database/connection-test';

// Setup global para todos los tests de integración
beforeAll(async () => {
  console.log('🔧 Initializing test database...');

  try {
    // Si ya está inicializado, destruir primero
    if (TestDataSource.isInitialized) {
      await TestDataSource.destroy();
    }

    // Inicializar sin synchronize primero para limpiar manualmente
    const { DataSource } = await import('typeorm');
    const tempDataSource = new DataSource({
      ...TestDataSource.options,
      synchronize: false,
      dropSchema: false,
    });

    await tempDataSource.initialize();

    // Limpiar manualmente todas las tablas
    try {
      await tempDataSource.query('SET FOREIGN_KEY_CHECKS = 0');

      // Obtener todas las tablas
      const tables = await tempDataSource.query(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = DATABASE()
      `);

      // Eliminar cada tabla
      for (const table of tables) {
        await tempDataSource.query(`DROP TABLE IF EXISTS \`${table.TABLE_NAME}\``);
      }

      await tempDataSource.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (cleanupError) {
      console.warn('⚠️  Error during cleanup:', cleanupError);
    }

    await tempDataSource.destroy();

    // Ahora inicializar con synchronize para crear esquema limpio
    await TestDataSource.initialize();
    console.log('✅ Test database connected successfully');
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
