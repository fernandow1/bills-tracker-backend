import { Shop } from '@domain/entities/shop.entity';

export abstract class ShopRepository {
  abstract getAllShops(): Promise<Shop[]>;
  abstract createShop(shop: Shop): Promise<Shop>;
  abstract updateShop(id: number, shop: Shop): Promise<Shop>;
  abstract deleteShop(id: number): Promise<void>;
}
