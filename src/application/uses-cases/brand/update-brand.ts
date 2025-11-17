import { UpdateBrandDTO } from '@application/dtos/brand/update-brand.dto';
import { Brand } from '@domain/entities/brand.entity';
import { BrandRepository } from '@domain/repository/brand.repository';

export interface UpdateBrandUseCase {
  execute(id: number, dto: UpdateBrandDTO): Promise<Brand>;
}

export class UpdateBrand implements UpdateBrandUseCase {
  constructor(private readonly brandRepository: BrandRepository) {}

  async execute(id: number, dto: UpdateBrandDTO): Promise<Brand> {
    return this.brandRepository.update(id, dto);
  }
}
