import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';
import { ShopDataSource } from '@domain/datasources/shop.datasource';
import { Shop } from '@infrastructure/database/entities/shop.entity';
import { DataSource } from 'typeorm';
import { shopToDomain, shopsToDomain } from '@infrastructure/mappers/shop.mapper';
import { Shop as DomainShop } from '@domain/entities/shop.entity';

export class ShopDataSourceImpl extends ShopDataSource {
  constructor(private readonly dataSource: DataSource) {
    super();
  }

  async search(filter: IQueryFilter): Promise<Pagination<DomainShop>> {
    const { page, pageSize, filter: where } = filter;

    const [data, count] = await this.dataSource.getRepository(Shop).findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data: shopsToDomain(data),
      count,
    };
  }

  async findAll(): Promise<DomainShop[]> {
    const shops = await this.dataSource.getRepository(Shop).find();
    return shopsToDomain(shops);
  }

  async createShop(shopData: Partial<DomainShop>): Promise<DomainShop> {
    const saved = await this.dataSource.getRepository(Shop).save(shopData as any);
    return shopToDomain(saved);
  }

  async updateShop(id: number, shopData: Partial<DomainShop>): Promise<DomainShop> {
    const existingShop = await this.dataSource.getRepository(Shop).findOneOrFail({
      where: { id },
    });

    // Actualizar con los nuevos datos
    this.dataSource.getRepository(Shop).merge(existingShop, shopData as any);
    const updated = await this.dataSource.getRepository(Shop).save(existingShop);
    return shopToDomain(updated);
  }

  async deleteShop(id: number): Promise<void> {
    await this.dataSource.getRepository(Shop).softDelete(id);
  }
}
