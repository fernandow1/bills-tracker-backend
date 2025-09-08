import { ProductDataSource } from '@domain/datasources/product.datasource';
import { CreateProductDTO } from '@application/dtos/product/create-product.dto';
import { UpdateProductDTO } from '@application/dtos/product/update-product.dto';
import { BrandCategory } from '@infrastructure/database/entities/brand-category.entity';
import { AppDataSource } from '@infrastructure/database/connection';
import { Product } from '@infrastructure/database/entities/product.entity';

export class ProductDataSourceImpl extends ProductDataSource {
  async createProduct(product: CreateProductDTO): Promise<Product> {
    const queryRunner = AppDataSource.createQueryRunner();
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
    const product = await AppDataSource.getRepository(Product).findOneByOrFail({
      id,
    });
    return product;
  }

  async updateProduct(id: number, product: UpdateProductDTO): Promise<UpdateProductDTO> {
    const queryRunner = AppDataSource.createQueryRunner();
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
    const existingProduct = await AppDataSource.getRepository(Product).findOneOrFail({
      where: { id },
    });

    await AppDataSource.getRepository(Product).softDelete(existingProduct.id);
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await AppDataSource.getRepository(Product).find();
    return products;
  }
}
