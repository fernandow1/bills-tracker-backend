import { ProductDataSource } from '@domain/datasources/product.datasource';
import { CreateProductDTO } from '@application/dtos/product/create-product.dto';
import { UpdateProductDTO } from '@application/dtos/product/update-product.dto';
import { Product } from '@domain/entities/product.entity';
import { ProductRepository } from '@domain/repository/product.repository';

export class ProductRepositoryImpl implements ProductRepository {
  private readonly productDataSource: ProductDataSource;
  constructor(productDataSource: ProductDataSource) {
    this.productDataSource = productDataSource;
  }

  createProduct(product: CreateProductDTO): Promise<Product> {
    return this.productDataSource.createProduct(product);
  }
  getProductById(id: number): Promise<Product> {
    return this.productDataSource.getProductById(id);
  }
  updateProduct(id: number, product: UpdateProductDTO): Promise<UpdateProductDTO> {
    return this.productDataSource.updateProduct(id, product);
  }
  deleteProduct(id: number): Promise<void> {
    return this.productDataSource.deleteProduct(id);
  }
  getAllProducts(): Promise<Product[]> {
    return this.productDataSource.getAllProducts();
  }
}
