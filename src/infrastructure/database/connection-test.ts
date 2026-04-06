/* eslint-disable @typescript-eslint/naming-convention */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'node:path';

import { DATABASE_ENTITIES } from '@infrastructure/database/entities';

export const TestDataSource = new DataSource({
  type: 'mysql',
  host: process.env.TEST_DB_HOST || 'localhost',
  port: Number(process.env.TEST_DB_PORT) || 3309,
  username: process.env.TEST_DB_USER || 'root',
  password: process.env.TEST_DB_PASSWORD || 'testroot',
  database: process.env.TEST_DB_NAME || 'bills_tracker_test',
  synchronize: true,
  logging: false,
  entities: DATABASE_ENTITIES,
  migrations: [path.join(process.cwd(), 'migrations', '*.js')],
  subscribers: [],
});
