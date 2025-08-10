/* eslint-disable @typescript-eslint/naming-convention */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'node:path';
import { envs } from '@infrastructure/config/env';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  username: envs.DB_USER,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [path.resolve(__dirname, '../database/entities/*.ts')],
  migrationsRun: false,
  migrations: [path.resolve(__dirname, '../../../migrations/*.js')],
  subscribers: [],
});
