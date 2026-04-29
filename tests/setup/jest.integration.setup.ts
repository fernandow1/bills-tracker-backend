import { TestDataSource } from '../../src/infrastructure/database/connection-test';
import { AppDataSource } from '../../src/infrastructure/database/connection';

// Setup global para todos los tests de integración
beforeAll(async () => {
  console.log('🔧 Initializing test database...');

  try {
    // Si ya está inicializado, no hacer nada especial
    if (!TestDataSource.isInitialized) {
      await TestDataSource.initialize();
    }
    // Inicializar AppDataSource para que la App interna tenga a dónde pegarle en sus controllers
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
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
  }
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  console.log('✅ Test databases disconnected');
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

    // Plantar roles por defecto
    await TestDataSource.query(
      `INSERT INTO \`role\` (id, name, description, created_at, updated_at) VALUES 
      (1, 'admin', 'Administrator role', NOW(), NOW()),
      (2, 'user', 'Standard user role', NOW(), NOW()),
      (3, 'guest', 'Guest role', NOW(), NOW())`
    );

    // Plantar usuarios por defecto para las pruebas
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await TestDataSource.query(
      `INSERT INTO \`user\` (id, name, email, username, password, id_role, created_at, updated_at) VALUES 
      (1, 'Admin Test', 'admin@example.com', 'admin_test', ?, 1, NOW(), NOW()),
      (2, 'User Test', 'user@example.com', 'user_test', ?, 3, NOW(), NOW())`,
      [hashedPassword, hashedPassword]
    );
  }
});
