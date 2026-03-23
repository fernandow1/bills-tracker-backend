import { ProductAlias } from '@domain/entities/product-alias.entity';

export interface ProductAliasRepository {
  create(productAlias: Partial<ProductAlias>): Promise<ProductAlias>;
  findByAliasAndShop(aliasName: string, idShop: number): Promise<ProductAlias | null>;
}
