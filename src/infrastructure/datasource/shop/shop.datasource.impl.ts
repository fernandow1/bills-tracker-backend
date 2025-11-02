import { ShopDataSource } from '@domain/datasources/shop.datasource';
import { Shop } from '@infrastructure/database/entities/shop.entity';
import { DataSource } from 'typeorm';

export class ShopDataSourceImpl extends ShopDataSource {
  constructor(private readonly dataSource: DataSource) {
    super();
  }

  async getAllShops(): Promise<Shop[]> {
    const shops = await this.dataSource.getRepository(Shop).find();
    return shops;
  }

  async createShop(shopData: Shop): Promise<Shop> {
    return this.dataSource.getRepository(Shop).save(shopData);
  }

  async updateShop(id: number, shopData: Partial<Shop>): Promise<Shop> {
    const shop = { id, ...shopData };
    return this.dataSource.getRepository(Shop).save(shop);
  }

  async deleteShop(id: number): Promise<void> {
    await this.dataSource.getRepository(Shop).softDelete(id);
  }
}
