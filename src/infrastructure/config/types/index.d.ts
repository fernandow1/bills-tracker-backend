import type { SafeUser } from '@application/uses-cases/user/types/auth-user.type';

declare module 'express-serve-static-core' {
  interface Request {
    user: SafeUser;
  }
}

export {};
