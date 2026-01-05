import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';
import { User } from '@domain/entities/user.entity';
import { UserRepository } from '@domain/repository/user.repository';

export interface SearchUserUseCase {
  execute(filter: IQueryFilter): Promise<Pagination<User>>;
}

export class SearchUser implements SearchUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(filter: IQueryFilter): Promise<Pagination<User>> {
    const { count, data } = await this.userRepository.search(filter);
    return {
      data,
      count,
    };
  }
}
