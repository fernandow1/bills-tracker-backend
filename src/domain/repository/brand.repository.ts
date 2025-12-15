import { CreateBrandDTO } from '@application/dtos/brand/create-brand.dto';
import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';
import { Brand } from '@domain/entities/brand.entity';

export abstract class BrandRepository {
  abstract search(filter: IQueryFilter): Promise<Pagination<Brand>>;
  abstract create(brand: CreateBrandDTO): Promise<Brand>;
  abstract update(id: number, dto: Partial<Brand>): Promise<Brand>;
  abstract findAll(): Promise<Brand[]>;
  abstract delete(id: number): Promise<void>;
}
