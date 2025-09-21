import { User } from '@domain/entities/user.entity';

export type SafeUser = Omit<User, 'password' | 'ssn'>;

export type AuthUser = Partial<SafeUser> & { token: string };
