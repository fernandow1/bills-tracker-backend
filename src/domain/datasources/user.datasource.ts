import { User } from '@domain/entities/user.entity';

export abstract class UserDataSource {
  abstract getUsers(): Promise<User[]>;
  abstract createUser(userData: Partial<User>): Promise<User>;
  abstract getUserById(id: number): Promise<User | null>;
  abstract getUserByUsername(username: string): Promise<User | null>;
  abstract updateUser(id: number, userData: Partial<User>): Promise<User>;
  abstract deleteUser(id: number): Promise<void>;
}
