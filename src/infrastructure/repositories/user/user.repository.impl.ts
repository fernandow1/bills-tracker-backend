import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';
import { UserDataSource } from '@domain/datasources/user.datasource';
import { User } from '@domain/entities/user.entity';
import { UserRepository } from '@domain/repository/user.repository';

export class UserRepositoryImpl implements UserRepository {
  private userDataSource: UserDataSource;

  constructor(userDataSource: UserDataSource) {
    this.userDataSource = userDataSource;
  }

  search(filter: IQueryFilter): Promise<Pagination<User>> {
    return this.userDataSource.search(filter);
  }

  findAll(): Promise<User[]> {
    return this.userDataSource.getUsers();
  }
  findById(id: number): Promise<User | null> {
    return this.userDataSource.getUserById(id);
  }

  findByUsername(username: string): Promise<User | null> {
    return this.userDataSource.getUserByUsername(username);
  }

  create(user: Partial<User>): Promise<User> {
    return this.userDataSource.createUser(user);
  }
  update(id: number, user: Partial<User>): Promise<User | null> {
    return this.userDataSource.updateUser(id, user);
  }
  delete(id: number): Promise<void> {
    return this.userDataSource.deleteUser(id);
  }
}
