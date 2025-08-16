import { UserDataSource } from '@domain/datasources/user.datasource';
import { AppDataSource } from '@infrastructure/database/connection';
import { User } from '@infrastructure/database/entities/user.entity';

export class UserDataSourceImpl implements UserDataSource {
  async getUsers(): Promise<User[]> {
    return AppDataSource.getRepository(User).find();
  }
  async createUser(userData: Partial<User>): Promise<User> {
    return AppDataSource.getRepository(User).save(userData);
  }

  async getUserById(id: number): Promise<User | null> {
    return AppDataSource.getRepository(User).findOneBy({ id });
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const query = AppDataSource.getRepository(User).createQueryBuilder('user');
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
    const user = await AppDataSource.getRepository(User).findOneBy({ id });
    if (!user) throw new Error('User not found');
    const updatedUser = { id, ...userData };
    return AppDataSource.getRepository(User).save(updatedUser);
  }
  async deleteUser(id: number): Promise<void> {
    const user = await AppDataSource.getRepository(User).findOneBy({ id });
    if (!user) throw new Error('User not found');
    await AppDataSource.getRepository(User).softDelete(id);
  }
}
