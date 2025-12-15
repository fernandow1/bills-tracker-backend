import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';
import { Brand } from '@domain/entities/brand.entity';
import { BrandRepository } from '@domain/repository/brand.repository';

interface SearchUseCase {
  execute(filter: IQueryFilter): Promise<Pagination<Brand>>;
}

export class SearchBrand implements SearchUseCase {
  constructor(private readonly brandRepository: BrandRepository) {}

  async execute(filter: IQueryFilter): Promise<Pagination<Brand>> {
    const { count, data } = await this.brandRepository.search(filter);
    return {
      count,
      data,
    };
  }
}
