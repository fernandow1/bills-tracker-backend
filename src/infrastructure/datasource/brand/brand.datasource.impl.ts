import { BrandDatasource } from '@domain/datasources/brand.datasource';
import { CreateBrandDTO } from '@domain/dtos/brand/create-brand.dto';
import { AppDataSource } from '@infrastructure/database/connection';
import { Brand } from '@infrastructure/database/entities/brand.entity';

export class BrandDataSourceImpl implements BrandDatasource {
  async create(brand: CreateBrandDTO): Promise<Brand> {
    return AppDataSource.getRepository(Brand).save(brand);
  }

  async findAll(): Promise<Brand[]> {
    return AppDataSource.getRepository(Brand).find();
  }
}
