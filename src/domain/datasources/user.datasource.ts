import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';
import { User } from '@domain/entities/user.entity';

export abstract class UserDataSource {
  abstract search(filter: IQueryFilter): Promise<Pagination<User>>;
  abstract getUsers(): Promise<User[]>;
  abstract createUser(userData: Partial<User>): Promise<User>;
  abstract getUserById(id: number): Promise<User | null>;
  abstract getUserByUsername(username: string): Promise<User | null>;
  abstract updateUser(id: number, userData: Partial<User>): Promise<User>;
  abstract deleteUser(id: number): Promise<void>;
}
