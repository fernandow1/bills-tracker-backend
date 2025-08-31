import { CreateProductDTO } from '@domain/dtos/product/create-product.dto';
import { UpdateProductDTO } from '@domain/dtos/product/update-product.dto';
import { Product } from '@domain/entities/product.entity';

export abstract class ProductDataSource {
  abstract createProduct(product: CreateProductDTO): Promise<Product>;
  abstract getProductById(id: number): Promise<Product>;
  abstract updateProduct(id: number, product: UpdateProductDTO): Promise<UpdateProductDTO>;
  abstract deleteProduct(id: number): Promise<void>;
  abstract getAllProducts(): Promise<Product[]>;
}
