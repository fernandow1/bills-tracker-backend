import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';
import { Shop } from '@domain/entities/shop.entity';

export abstract class ShopRepository {
  abstract search(filter: IQueryFilter): Promise<Pagination<Shop>>;
  abstract findAll(): Promise<Shop[]>;
  abstract createShop(shop: Partial<Shop>): Promise<Shop>;
  abstract updateShop(id: number, shop: Partial<Shop>): Promise<Shop>;
  abstract deleteShop(id: number): Promise<void>;
}
