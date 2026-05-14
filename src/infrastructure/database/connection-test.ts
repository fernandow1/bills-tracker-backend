/* eslint-disable @typescript-eslint/naming-convention */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'node:path';

import { DATABASE_ENTITIES } from '@infrastructure/database/entities';

export const TestDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'testroot',
  database: process.env.DB_NAME || 'bills_tracker_test',
  synchronize: false,
  logging: false,
  entities: DATABASE_ENTITIES,
  migrations: [path.join(process.cwd(), 'migrations', '*.js')],
  subscribers: [],
});
