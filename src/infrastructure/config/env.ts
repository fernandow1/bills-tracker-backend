/* eslint-disable @typescript-eslint/naming-convention */
import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  DB_HOST: get('DB_HOST').required().asString(),
  DB_PORT: get('DB_PORT').default('3306').asPortNumber(),
  DB_USER: get('DB_USER').required().asString(),
  DB_PASSWORD: get('DB_PASSWORD').required().asString(),
  DB_NAME: get('DB_NAME').required().asString(),
  DB_ROOT_PASSWORD: get('DB_ROOT_PASSWORD').required().asString(),
  JWT_SECRET: get('JWT_SECRET').required().asString(),
};
