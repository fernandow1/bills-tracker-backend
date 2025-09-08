import { CreateBrandDTO } from '@application/dtos/brand/create-brand.dto';
import { Brand } from '@domain/entities/brand.entity';
import { BrandRepository } from '@domain/repository/brand.repository';

export interface CreateBrandUseCase {
  execute(brandData: CreateBrandDTO): Promise<Brand>;
}

export class CreateBrand implements CreateBrandUseCase {
  constructor(private readonly brandRepository: BrandRepository) {
    this.brandRepository = brandRepository;
  }

  async execute(brandData: CreateBrandDTO): Promise<Brand> {
    return this.brandRepository.create(brandData);
  }
}
