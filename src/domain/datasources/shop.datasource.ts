import { Shop } from '../entities/shop.entity';

export abstract class ShopDataSource {
  abstract getShops(): Promise<Shop[]>;
  abstract createShop(shopData: Shop): Promise<Shop>;
  abstract updateShop(id: number, shopData: Partial<Shop>): Promise<Shop>;
  abstract deleteShop(id: number): Promise<void>;
}
