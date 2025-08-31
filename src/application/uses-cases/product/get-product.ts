import { Product } from '@domain/entities/product.entity';
import { ProductRepository } from '@domain/repository/product.repository';

export interface GetProductUseCase {
  execute(id: number): Promise<Product>;
}

export class GetProduct implements GetProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }
  async execute(id: number): Promise<Product> {
    return this.productRepository.getProductById(id);
  }
}
