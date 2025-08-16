import { User } from '@domain/entities/user.entity';

type SafeUser = Omit<User, 'password' | 'ssn'>;

export type AuthUser = Partial<SafeUser> & { token: string };
