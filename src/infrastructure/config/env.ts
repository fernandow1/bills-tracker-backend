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
  REMOTE_DB_HOST: isTest
    ? get('REMOTE_MYSQLHOST').default('localhost').asString()
    : get('REMOTE_MYSQLHOST').required().asString(),
  REMOTE_DB_PORT: isTest
    ? get('REMOTE_MYSQLPORT').default('3306').asPortNumber()
    : get('REMOTE_MYSQLPORT').required().asPortNumber(),
  REMOTE_DB_USER: isTest
    ? get('REMOTE_MYSQLUSER').default('remote_user').asString()
    : get('REMOTE_MYSQLUSER').required().asString(),
  REMOTE_DB_PASSWORD: isTest
    ? get('REMOTE_MYSQLPASSWORD').default('remote_password').asString()
    : get('REMOTE_MYSQLPASSWORD').required().asString(),
  REMOTE_DB_NAME: isTest
    ? get('REMOTE_MYSQLDATABASE').default('remote_db').asString()
    : get('REMOTE_MYSQLDATABASE').required().asString(),
  JWT_SECRET: isTest
    ? get('JWT_SECRET').default('test-secret-key').asString()
    : get('JWT_SECRET').required().asString(),
  NODE_ENV: get('NODE_ENV').default('development').asString(),
};
