import type { SafeUser } from '@application/uses-cases/user/types/auth-user.type';
import type { QueryFilterDTO } from '@infrastructure/http/dto/query-filter.dto';

declare module 'express-serve-static-core' {
  interface Request {
    user: SafeUser;
    queryFilter?: QueryFilterDTO;
  }
}

export {};
