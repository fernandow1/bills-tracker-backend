import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';
import { User } from '@domain/entities/user.entity';

export abstract class UserRepository {
  abstract search(filter: IQueryFilter): Promise<Pagination<User>>;
  abstract findAll(): Promise<User[]>;
  abstract findById(id: number): Promise<User | null>;
  abstract findByUsername(username: string): Promise<User | null>;
  abstract create(user: Partial<User>): Promise<User>;
  abstract update(id: number, user: Partial<User>): Promise<User | null>;
  abstract delete(id: number): Promise<void>;
}
