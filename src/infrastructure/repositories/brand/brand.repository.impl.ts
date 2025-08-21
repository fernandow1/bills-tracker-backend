import { BrandDatasource } from '@domain/datasources/brand.datasource';
import { CreateBrandDTO } from '@domain/dtos/brand/create-brand.dto';
import { Brand } from '@domain/entities/brand.entity';
import { BrandRepository } from '@domain/repository/brand.repository';

export class BrandRepositoryImpl implements BrandRepository {
  private readonly brandDataSource: BrandDatasource;
  constructor(brandDataSource: BrandDatasource) {
    this.brandDataSource = brandDataSource;
  }

  create(brand: CreateBrandDTO): Promise<Brand> {
    return this.brandDataSource.create(brand);
  }
  findAll(): Promise<Brand[]> {
    return this.brandDataSource.findAll();
  }
}
