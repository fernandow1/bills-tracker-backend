/* eslint-disable @typescript-eslint/naming-convention */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
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
  entities: [__dirname + '/entities/*.entity.js'],
  migrationsRun: false,
  migrations: [__dirname + '/../../../migrations/*.ts'],
  subscribers: [],
});
