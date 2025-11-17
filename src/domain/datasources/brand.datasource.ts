import { CreateBrandDTO } from '@application/dtos/brand/create-brand.dto';
import { Brand } from '@domain/entities/brand.entity';

export abstract class BrandDatasource {
  abstract create(brand: CreateBrandDTO): Promise<Brand>;
  abstract findAll(): Promise<Brand[]>;
  abstract update(id: number, dto: Partial<Brand>): Promise<Brand>;
  abstract delete(id: number): Promise<void>;
}
