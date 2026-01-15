/* eslint-disable @typescript-eslint/naming-convention */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'node:path';
import { envs } from '@infrastructure/config/env';

export const RemoteDataSource = new DataSource({
  type: 'mysql',
  host: envs.REMOTE_DB_HOST,
  port: envs.REMOTE_DB_PORT,
  username: envs.REMOTE_DB_USER,
  password: envs.REMOTE_DB_PASSWORD,
  database: envs.REMOTE_DB_NAME,
  synchronize: false,
  logging: false,
  entities: [path.join(process.cwd(), 'dist', 'infrastructure', 'database', 'entities', '*.js')],
  migrationsRun: false,
  migrations: [path.join(process.cwd(), 'migrations', '*.js')],
  subscribers: [],
});
