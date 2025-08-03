import { ShopDataSource } from '@domain/datasources/shop.datasource';
import { AppDataSource } from '@infrastructure/database/connection';
import { Shop } from '@infrastructure/database/entities/shop.entity';

export class ShopDataSourceImpl implements ShopDataSource {
  async getShops(): Promise<Shop[]> {
    const shops = await AppDataSource.getRepository(Shop).find();
    return shops;
  }

  async createShop(shopData: Shop): Promise<Shop> {
    return AppDataSource.getRepository(Shop).save(shopData);
  }

  async updateShop(id: number, shopData: Partial<Shop>): Promise<Shop> {
    const shop = { id, ...shopData };
    return AppDataSource.getRepository(Shop).save(shop);
  }

  async deleteShop(id: number): Promise<void> {
    await AppDataSource.getRepository(Shop).softDelete(id);
  }
}
