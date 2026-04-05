import jwt from 'jsonwebtoken';
import { envs } from '../../src/infrastructure/config/env';

export const TEST_ADMIN_USER_ID = 1;
export const TEST_NORMAL_USER_ID = 2;

export const getAdminToken = (): string => {
  return jwt.sign({ sub: TEST_ADMIN_USER_ID.toString() }, envs.JWT_SECRET || 'test-secret', {
    expiresIn: '1h',
  });
};

export const getNormalUserToken = (): string => {
  return jwt.sign({ sub: TEST_NORMAL_USER_ID.toString() }, envs.JWT_SECRET || 'test-secret', {
    expiresIn: '1h',
  });
};

export const getAuthHeader = (isAdmin = true): string => {
  const token = isAdmin ? getAdminToken() : getNormalUserToken();
  return `Bearer ${token}`;
};
