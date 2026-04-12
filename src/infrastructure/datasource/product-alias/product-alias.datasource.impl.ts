import { DataSource } from 'typeorm';
import { ProductAlias } from '@domain/entities/product-alias.entity';
import { ProductAliasEntity } from '@infrastructure/database/entities/product-alias.entity';

export interface ProductAliasDataSource {
  create(productAlias: Partial<ProductAlias>): Promise<ProductAlias>;
  findByAliasAndShop(aliasName: string, idShop: number): Promise<ProductAlias | null>;
}

export class ProductAliasDataSourceImpl implements ProductAliasDataSource {
  constructor(private readonly dataSource: DataSource) {}

  async create(productAlias: Partial<ProductAlias>): Promise<ProductAlias> {
    const repository = this.dataSource.getRepository(ProductAliasEntity);
    const newAliasEntity = repository.create({
      idProduct: productAlias.idProduct,
      idShop: productAlias.idShop,
      aliasName: productAlias.aliasName,
    });

    const savedEntity = await repository.save(newAliasEntity);

    return new ProductAlias(
      savedEntity.id,
      savedEntity.idProduct,
      savedEntity.idShop,
      savedEntity.aliasName,
    );
  }

  async findByAliasAndShop(aliasName: string, idShop: number): Promise<ProductAlias | null> {
    const repository = this.dataSource.getRepository(ProductAliasEntity);
    const aliasEntity = await repository.findOne({
      where: { aliasName, idShop },
    });

    if (!aliasEntity) return null;

    return new ProductAlias(
      aliasEntity.id,
      aliasEntity.idProduct,
      aliasEntity.idShop,
      aliasEntity.aliasName,
    );
  }
}
