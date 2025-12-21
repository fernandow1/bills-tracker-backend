import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';
import { Product } from '@domain/entities/product.entity';
import { ProductRepository } from '@domain/repository/product.repository';

interface SearchUseCase {
  execute(filter: IQueryFilter): Promise<Pagination<Product>>;
}

export class SearchProduct implements SearchUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(filter: IQueryFilter): Promise<Pagination<Product>> {
    const { count, data } = await this.productRepository.search(filter);
    return {
      data,
      count,
    };
  }
}
