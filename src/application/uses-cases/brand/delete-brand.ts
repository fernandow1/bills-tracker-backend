import { BrandRepository } from '@domain/repository/brand.repository';

export interface DeleteBrandUseCase {
  execute(id: number): Promise<void>;
}

export class DeleteBrand implements DeleteBrandUseCase {
  constructor(private readonly brandRepository: BrandRepository) {}

  async execute(id: number): Promise<void> {
    return this.brandRepository.delete(id);
  }
}
