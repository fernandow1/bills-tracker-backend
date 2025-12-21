import { CreateProductDTO } from '@application/dtos/product/create-product.dto';
import { UpdateProductDTO } from '@application/dtos/product/update-product.dto';
import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';
import { Product } from '@domain/entities/product.entity';

export abstract class ProductDataSource {
  abstract search(filter: IQueryFilter): Promise<Pagination<Product>>;
  abstract createProduct(product: CreateProductDTO): Promise<Product>;
  abstract getProductById(id: number): Promise<Product>;
  abstract updateProduct(id: number, product: UpdateProductDTO): Promise<UpdateProductDTO>;
  abstract deleteProduct(id: number): Promise<void>;
  abstract getAllProducts(): Promise<Product[]>;
}
