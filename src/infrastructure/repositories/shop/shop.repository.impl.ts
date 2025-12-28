import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';
import { ShopDataSource } from '@domain/datasources/shop.datasource';
import { Shop } from '@domain/entities/shop.entity';
import { ShopRepository } from '@domain/repository/shop.repository';

export class ShopRepositoryImpl implements ShopRepository {
  private shopDataSource: ShopDataSource;

  constructor(shopDataSource: ShopDataSource) {
    this.shopDataSource = shopDataSource;
  }

  search(filter: IQueryFilter): Promise<Pagination<Shop>> {
    return this.shopDataSource.search(filter);
  }

  getAllShops(): Promise<Shop[]> {
    return this.shopDataSource.getAllShops();
  }

  createShop(shop: Partial<Shop>): Promise<Shop> {
    return this.shopDataSource.createShop(shop);
  }

  updateShop(id: number, shop: Partial<Shop>): Promise<Shop> {
    return this.shopDataSource.updateShop(id, shop);
  }

  deleteShop(id: number): Promise<void> {
    return this.shopDataSource.deleteShop(id);
  }
}
