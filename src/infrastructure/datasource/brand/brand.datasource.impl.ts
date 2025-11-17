import { BrandDatasource } from '@domain/datasources/brand.datasource';
import { CreateBrandDTO } from '@application/dtos/brand/create-brand.dto';
import { Brand } from '@infrastructure/database/entities/brand.entity';
import { DataSource } from 'typeorm';

export class BrandDataSourceImpl implements BrandDatasource {
  constructor(private readonly datasource: DataSource) {}

  async create(brand: CreateBrandDTO): Promise<Brand> {
    const brandEntity = this.datasource.getRepository(Brand).create(brand);
    return this.datasource.getRepository(Brand).save(brandEntity);
  }

  async update(id: number, brand: CreateBrandDTO): Promise<Brand> {
    const brandRepository = this.datasource.getRepository(Brand);
    const brandToUpdate = await brandRepository.findOneOrFail({ where: { id } });
    brandRepository.merge(brandToUpdate, brand);
    return brandRepository.save(brandToUpdate);
  }

  async delete(id: number): Promise<void> {
    await this.datasource.getRepository(Brand).softDelete(id);
  }

  async findAll(): Promise<Brand[]> {
    return this.datasource.getRepository(Brand).find();
  }
}
