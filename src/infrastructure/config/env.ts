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
  JWT_SECRET: isTest
    ? get('JWT_SECRET').default('test-secret-key').asString()
    : get('JWT_SECRET').required().asString(),
  NODE_ENV: get('NODE_ENV').default('development').asString(),
};
