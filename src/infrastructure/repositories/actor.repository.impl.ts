import { ShopDataSource } from '@/domain/datasources/shop.datasource';
import { Shop } from '@/domain/entities/shop.entity';
import { ShopRepository } from '@/domain/repository/shop.repository';

export class ShopRepositoryImpl implements ShopRepository {
  private shopDataSource: ShopDataSource;

  constructor(shopDataSource: ShopDataSource) {
    this.shopDataSource = shopDataSource;
  }

  getAllShops(): Promise<Shop[]> {
    return this.shopDataSource.getShops();
  }

  createShop(shop: Shop): Promise<Shop> {
    return this.shopDataSource.createShop(shop);
  }

  updateShop(id: number, shop: Shop): Promise<Shop> {
    return this.shopDataSource.updateShop(id, shop);
  }

  deleteShop(id: number): Promise<boolean> {
    return this.shopDataSource.deleteShop(id);
  }
}
