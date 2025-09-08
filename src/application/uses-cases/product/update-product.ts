import { UpdateProductDTO } from '@application/dtos/product/update-product.dto';
import { ProductRepository } from '@domain/repository/product.repository';

export interface UpdateProductUseCase {
  execute(id: number, data: UpdateProductDTO): Promise<UpdateProductDTO>;
}

export class UpdateProduct implements UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }
  async execute(id: number, data: UpdateProductDTO): Promise<UpdateProductDTO> {
    return this.productRepository.updateProduct(id, data);
  }
}
