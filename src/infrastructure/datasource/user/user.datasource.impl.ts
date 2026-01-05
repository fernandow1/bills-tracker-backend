import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';
import { UserDataSource } from '@domain/datasources/user.datasource';
import { User } from '@infrastructure/database/entities/user.entity';
import { DataSource } from 'typeorm';

export class UserDataSourceImpl implements UserDataSource {
  constructor(private readonly dataSource: DataSource) {}

  async search(filter: IQueryFilter): Promise<Pagination<User>> {
    const { page, pageSize, filter: where } = filter;

    const [data, count] = await this.dataSource.getRepository(User).findAndCount({
      where,
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data,
      count,
    };
  }

  async getUsers(): Promise<User[]> {
    return this.dataSource.getRepository(User).find();
  }
  async createUser(userData: Partial<User>): Promise<User> {
    return this.dataSource.getRepository(User).save(userData);
  }

  async getUserById(id: number): Promise<User | null> {
    return this.dataSource.getRepository(User).findOneBy({ id });
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const query = this.dataSource.getRepository(User).createQueryBuilder('user');
    query.where('user.username = :username', { username });
    query.select([
      'user.id',
      'user.username',
      'user.password',
      'user.email',
      'user.name',
      'user.surname',
    ]);
    return query.getOne();
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.dataSource.getRepository(User).findOneBy({ id });
    if (!user) throw new Error('User not found');
    const updatedUser = { id, ...userData };
    return this.dataSource.getRepository(User).save(updatedUser);
  }
  async deleteUser(id: number): Promise<void> {
    const user = await this.dataSource.getRepository(User).findOneBy({ id });
    if (!user) throw new Error('User not found');
    await this.dataSource.getRepository(User).softDelete(id);
  }
}
