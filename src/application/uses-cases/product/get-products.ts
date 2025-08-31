import { Product } from '@domain/entities/product.entity';
import { ProductRepository } from '@domain/repository/product.repository';

export interface GetProductsCaseUse {
  execute(): Promise<Product[]>;
}

export class GetProducts implements GetProductsCaseUse {
  constructor(private readonly productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }
  async execute(): Promise<Product[]> {
    return this.productRepository.getAllProducts();
  }
}
