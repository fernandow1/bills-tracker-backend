/* eslint-disable @typescript-eslint/naming-convention */
import 'dotenv/config';
import { get } from 'env-var';

const isTest = process.env.NODE_ENV === 'test';

export const envs = {
  PORT_TEST: get('PORT_TEST').default('3001').asPortNumber(),
  PORT: isTest ? get('PORT').default('3000').asPortNumber() : get('PORT').required().asPortNumber(),
  DB_HOST: isTest
    ? get('MYSQLHOST').default('localhost').asString()
    : get('MYSQLHOST').required().asString(),
  DB_PORT: get('MYSQLPORT').default('3306').asPortNumber(),
  DB_USER: isTest
    ? get('MYSQLUSER').default('test').asString()
    : get('MYSQLUSER').required().asString(),
  DB_PASSWORD: isTest
    ? get('MYSQLPASSWORD').default('test').asString()
    : get('MYSQLPASSWORD').required().asString(),
  DB_NAME: isTest
    ? get('MYSQLDATABASE').default('test_db').asString()
    : get('MYSQLDATABASE').required().asString(),
  DB_ROOT_PASSWORD: get('DB_ROOT_PASSWORD').asString(),
  /* ONLY FOR LOCAL DEVELOPMENT - NOT REQUIRED IN PRODUCTION */
  REMOTE_DB_HOST: get('REMOTE_MYSQLHOST').default('localhost').asString(),
  REMOTE_DB_PORT: get('REMOTE_MYSQLPORT').default(3306).asPortNumber(),
  REMOTE_DB_USER: get('REMOTE_MYSQLUSER').default('').asString(),
  REMOTE_DB_PASSWORD: get('REMOTE_MYSQLPASSWORD').default('').asString(),
  REMOTE_DB_NAME: get('REMOTE_MYSQLDATABASE').default('').asString(),
  /* END ONLY FOR LOCAL DEVELOPMENT */
  JWT_SECRET: isTest
    ? get('JWT_SECRET').default('test-secret-key').asString()
    : get('JWT_SECRET').required().asString(),
  NODE_ENV: get('NODE_ENV').default('development').asString(),
  REDIS_URL: get('REDIS_URL').asString(),
  BETTERSTACK_SOURCE_TOKEN: get('BETTERSTACK_SOURCE_TOKEN').asString(),
  BETTERSTACK_ENDPOINT: get('BETTERSTACK_ENDPOINT')
    .default('https://in.logs.betterstack.com')
    .asString(),
};
