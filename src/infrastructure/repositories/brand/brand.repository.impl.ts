import { BrandDatasource } from '@domain/datasources/brand.datasource';
import { CreateBrandDTO } from '@application/dtos/brand/create-brand.dto';
import { Brand } from '@domain/entities/brand.entity';
import { BrandRepository } from '@domain/repository/brand.repository';

export class BrandRepositoryImpl implements BrandRepository {
  private readonly brandDataSource: BrandDatasource;
  constructor(brandDataSource: BrandDatasource) {
    this.brandDataSource = brandDataSource;
  }
  findAll(): Promise<Brand[]> {
    return this.brandDataSource.findAll();
  }

  create(brand: CreateBrandDTO): Promise<Brand> {
    return this.brandDataSource.create(brand);
  }

  update(id: number, dto: Partial<Brand>): Promise<Brand> {
    return this.brandDataSource.update(id, dto);
  }

  delete(id: number): Promise<void> {
    return this.brandDataSource.delete(id);
  }
}
