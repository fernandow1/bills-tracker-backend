import { Brand } from '@domain/entities/brand.entity';
import { BrandRepository } from '@domain/repository/brand.repository';

export interface GetBrandsUseCase {
  execute(): Promise<Brand[]>;
}

export class GetBrands implements GetBrandsUseCase {
  constructor(private readonly brandRepository: BrandRepository) {
    this.brandRepository = brandRepository;
  }

  async execute(): Promise<Brand[]> {
    return this.brandRepository.findAll();
  }
}
