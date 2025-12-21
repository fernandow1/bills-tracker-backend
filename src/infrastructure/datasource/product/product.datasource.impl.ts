import { ProductDataSource } from '@domain/datasources/product.datasource';
import { CreateProductDTO } from '@application/dtos/product/create-product.dto';
import { UpdateProductDTO } from '@application/dtos/product/update-product.dto';
import { BrandCategory } from '@infrastructure/database/entities/brand-category.entity';
import { Product } from '@infrastructure/database/entities/product.entity';
import { DataSource } from 'typeorm';
import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';

export class ProductDataSourceImpl extends ProductDataSource {
  constructor(private readonly dataSource: DataSource) {
    super();
  }

  async search(filter: IQueryFilter): Promise<Pagination<Product>> {
    const { page, pageSize, filter: where } = filter;

    const [data, count] = await this.dataSource.getRepository(Product).findAndCount({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        idBrand: true,
        idCategory: true,
        createdAt: true,
        category: {
          id: true,
          name: true,
        },
        brand: {
          id: true,
          name: true,
        },
      },
      relations: {
        brand: true,
        category: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data,
      count,
    };
  }

  async createProduct(product: CreateProductDTO): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const brandCategory = await queryRunner.manager.upsert(
        BrandCategory,
        {
          idBrand: product.idBrand,
          idCategory: product.idCategory,
        },
        ['idBrand', 'idCategory'],
      );

      if (!brandCategory) {
        throw new Error('BrandCategory save failed');
      }

      const newProduct = queryRunner.manager.create(Product, product);
      await queryRunner.manager.save(newProduct);
      await queryRunner.commitTransaction();
      return newProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.dataSource.getRepository(Product).findOneByOrFail({
      id,
    });
    return product;
  }

  async updateProduct(id: number, product: UpdateProductDTO): Promise<UpdateProductDTO> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const existingProduct = await queryRunner.manager.findOneOrFail(Product, {
        where: { id },
      });

      if ((product.idBrand && !product.idCategory) || (product.idCategory && !product.idBrand)) {
        throw new Error('Both idBrand and idCategory must be provided');
      }

      if (product.idBrand && product.idCategory) {
        const brandCategory = await queryRunner.manager.upsert(
          BrandCategory,
          {
            idBrand: product.idBrand,
            idCategory: product.idCategory,
          },
          ['idBrand', 'idCategory'],
        );

        if (!brandCategory) {
          throw new Error('BrandCategory save failed');
        }
      }

      const updateProduct = queryRunner.manager.merge(Product, existingProduct, product);
      const updatedProduct = await queryRunner.manager.save(updateProduct);
      await queryRunner.commitTransaction();
      return updatedProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteProduct(id: number): Promise<void> {
    const existingProduct = await this.dataSource.getRepository(Product).findOneOrFail({
      where: { id },
    });

    await this.dataSource.getRepository(Product).softDelete(existingProduct.id);
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await this.dataSource.getRepository(Product).find({
      relations: { brand: true, category: true },
    });
    return products;
  }
}
