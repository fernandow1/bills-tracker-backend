import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';
import { ShopDataSource } from '@domain/datasources/shop.datasource';
import { Shop } from '@infrastructure/database/entities/shop.entity';
import { DataSource } from 'typeorm';

export class ShopDataSourceImpl extends ShopDataSource {
  constructor(private readonly dataSource: DataSource) {
    super();
  }

  async search(filter: IQueryFilter): Promise<Pagination<Shop>> {
    const { page, pageSize, filter: where } = filter;

    const [data, count] = await this.dataSource.getRepository(Shop).findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data,
      count,
    };
  }

  async createShop(shopData: Partial<Shop>): Promise<Shop> {
    return this.dataSource.getRepository(Shop).save(shopData);
  }

  async updateShop(id: number, shopData: Partial<Shop>): Promise<Shop> {
    const existingShop = await this.dataSource.getRepository(Shop).findOneOrFail({
      where: { id },
    });

    // Actualizar con los nuevos datos
    this.dataSource.getRepository(Shop).merge(existingShop, shopData);
    return this.dataSource.getRepository(Shop).save(existingShop);
  }

  async deleteShop(id: number): Promise<void> {
    await this.dataSource.getRepository(Shop).softDelete(id);
  }
}
