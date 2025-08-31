import { ProductRepository } from '@domain/repository/product.repository';

export interface DeleteProductUseCase {
  execute(id: number): Promise<void>;
}

export class DeleteProduct implements DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }
  async execute(id: number): Promise<void> {
    return this.productRepository.deleteProduct(id);
  }
}
