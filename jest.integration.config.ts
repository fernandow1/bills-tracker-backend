import type { Config } from 'jest';
import baseConfig from './jest.config';

const INTEGRATION_CONFIG: Config = {
  ...baseConfig,
  // Configuración específica para tests de integración
  displayName: 'Integration Tests',
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.integration.setup.ts'],
  testMatch: [
    '**/*.integration.test.ts', // Solo archivos con .integration.test.ts
    '**/__tests__/integration/**/*.test.ts', // O en carpeta integration
  ],
  // ✅ Sobrescribir testPathIgnorePatterns para permitir archivos .integration.test.ts
  testPathIgnorePatterns: [
    '\\\\node_modules\\\\', // Solo ignorar node_modules
  ],
  moduleNameMapper: {
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@presentation/(.*)$': '<rootDir>/src/presentation/$1',
  },
  // Timeout más alto para tests de integración (BD puede ser lenta)
  testTimeout: 30000,
};

export default INTEGRATION_CONFIG;
