/* eslint-disable @typescript-eslint/naming-convention */
import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  PORT_TEST: get('PORT_TEST').default('3001').asPortNumber(),
  PORT: get('PORT').required().asPortNumber(),
  DB_HOST: get('MYSQLHOST').required().asString(),
  DB_PORT: get('MYSQLPORT').default('3306').asPortNumber(),
  DB_USER: get('MYSQLUSER').required().asString(),
  DB_PASSWORD: get('MYSQLPASSWORD').required().asString(),
  DB_NAME: get('MYSQLDATABASE').required().asString(),
  DB_ROOT_PASSWORD: get('DB_ROOT_PASSWORD').asString(),
  REMOTE_DB_HOST: get('REMOTE_MYSQLHOST').required().asString(),
  REMOTE_DB_PORT: get('REMOTE_MYSQLPORT').default('3306').asPortNumber(),
  REMOTE_DB_USER: get('REMOTE_MYSQLUSER').required().asString(),
  REMOTE_DB_PASSWORD: get('REMOTE_MYSQLPASSWORD').required().asString(),
  REMOTE_DB_NAME: get('REMOTE_MYSQLDATABASE').required().asString(),
  JWT_SECRET: get('JWT_SECRET').required().asString(),
};
