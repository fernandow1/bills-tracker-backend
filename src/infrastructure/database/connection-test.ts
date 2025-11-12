/* eslint-disable @typescript-eslint/naming-convention */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'node:path';

export const TestDataSource = new DataSource({
  type: 'mysql',
  host: process.env.TEST_DB_HOST || 'localhost',
  port: Number(process.env.TEST_DB_PORT) || 3309,
  username: process.env.TEST_DB_USER || 'testuser',
  password: process.env.TEST_DB_PASSWORD || 'testpass',
  database: process.env.TEST_DB_NAME || 'bills_tracker_test',
  synchronize: true, // ✅ Para tests: recrea esquema automáticamente
  logging: false, // ✅ Evita logs en tests
  dropSchema: true, // ✅ Limpia BD entre tests
  entities: [path.resolve(__dirname, '../database/entities/*.ts')],
  migrations: [], // ✅ No necesarias con synchronize: true
  subscribers: [],
});
