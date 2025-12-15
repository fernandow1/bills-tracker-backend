import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';
import { Category } from '@domain/entities/category.entity';
import { CategoryRepository } from '@domain/repository/category.repository';

interface SearchUseCase {
  execute(filter: IQueryFilter): Promise<Pagination<Category>>;
}

export class SearchCategory implements SearchUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(filter: IQueryFilter): Promise<Pagination<Category>> {
    const { count, data } = await this.categoryRepository.search(filter);
    return {
      data,
      count,
    };
  }
}
