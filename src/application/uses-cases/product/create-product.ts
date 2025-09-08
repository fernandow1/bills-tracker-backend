import { CreateProductDTO } from '@application/dtos/product/create-product.dto';
import { Product } from '@domain/entities/product.entity';
import { ProductRepository } from '@domain/repository/product.repository';

export interface CreateProductCaseUse {
  execute(data: CreateProductDTO): Promise<Product>;
}

export class CreateProduct implements CreateProductCaseUse {
  constructor(private readonly productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }
  async execute(data: CreateProductDTO): Promise<Product> {
    return this.productRepository.createProduct(data);
  }
}
