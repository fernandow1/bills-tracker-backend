import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';
import { Shop } from '@domain/entities/shop.entity';
import { ShopRepository } from '@domain/repository/shop.repository';

export interface SearchShopUseCase {
  execute(filter: IQueryFilter): Promise<Pagination<Shop>>;
}

export class SearchShop implements SearchShopUseCase {
  constructor(private readonly shopRepository: ShopRepository) {}

  async execute(filter: IQueryFilter): Promise<Pagination<Shop>> {
    const { count, data } = await this.shopRepository.search(filter);
    return {
      data,
      count,
    };
  }
}
