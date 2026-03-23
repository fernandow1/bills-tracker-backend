import { ProductAlias } from '@domain/entities/product-alias.entity';
import { ProductAliasRepository } from '@domain/repository/product-alias.repository';
import { ProductAliasDataSource } from '@infrastructure/datasource/product-alias/product-alias.datasource.impl';

export class ProductAliasRepositoryImpl implements ProductAliasRepository {
  constructor(private readonly datasource: ProductAliasDataSource) {}

  async create(productAlias: Partial<ProductAlias>): Promise<ProductAlias> {
    return this.datasource.create(productAlias);
  }

  async findByAliasAndShop(aliasName: string, idShop: number): Promise<ProductAlias | null> {
    return this.datasource.findByAliasAndShop(aliasName, idShop);
  }
}
