import { User } from '@domain/entities/user.entity';

export type SafeUser = Omit<User, 'password' | 'ssn'>;

export type AuthUser = {
  user: SafeUser;
  token: string;
  refreshToken: string;
};
