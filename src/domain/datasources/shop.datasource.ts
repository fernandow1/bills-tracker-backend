import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';
import { Shop } from '@domain/entities/shop.entity';

export abstract class ShopDataSource {
  abstract search(filter: IQueryFilter): Promise<Pagination<Shop>>;
  abstract getAllShops(): Promise<Shop[]>;
  abstract createShop(shopData: Partial<Shop>): Promise<Shop>;
  abstract updateShop(id: number, shopData: Partial<Shop>): Promise<Shop>;
  abstract deleteShop(id: number): Promise<void>;
}
