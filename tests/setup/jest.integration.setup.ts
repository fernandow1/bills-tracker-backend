import { TestDataSource } from '../../src/infrastructure/database/connection-test';

// Setup global para todos los tests de integración
beforeAll(async () => {
  console.log('🔧 Initializing test database...');

  try {
    // Si ya está inicializado, no hacer nada especial
    if (!TestDataSource.isInitialized) {
      await TestDataSource.initialize();
    }
    
    // Evitar bug de TypeORM de 'Table already exists' con dropSchema explícito
    await TestDataSource.dropDatabase();
    await TestDataSource.synchronize();
    
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

// Limpiar datos y plantar base antes de cada test
beforeEach(async () => {
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

    // Plantar usuarios por defecto para las pruebas
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await TestDataSource.query(
      `INSERT INTO \`user\` (id, name, email, username, password, role, created_at, updated_at) VALUES 
      (1, 'Admin Test', 'admin@example.com', 'admin_test', ?, 'admin', NOW(), NOW()),
      (2, 'User Test', 'user@example.com', 'user_test', ?, 'guest', NOW(), NOW())`,
      [hashedPassword, hashedPassword]
    );
  }
});
