import supertest from 'supertest';
import { Application } from 'express';
import { getAuthHeader } from './auth.helper';

export const createAuthRequest = (app: Application) => {
  const agent = supertest(app);
  const token = getAuthHeader(); // Default to Admin
  
  return {
    get: (url: string) => agent.get(url).set('Authorization', token),
    post: (url: string) => agent.post(url).set('Authorization', token),
    put: (url: string) => agent.put(url).set('Authorization', token),
    delete: (url: string) => agent.delete(url).set('Authorization', token),
    patch: (url: string) => agent.patch(url).set('Authorization', token),
  };
};
