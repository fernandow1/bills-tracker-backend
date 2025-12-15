import { BrandDatasource } from '@domain/datasources/brand.datasource';
import { CreateBrandDTO } from '@application/dtos/brand/create-brand.dto';
import { Brand } from '@infrastructure/database/entities/brand.entity';
import { DataSource } from 'typeorm';
import { UpdateBrandDTO } from '@application/dtos/brand/update-brand.dto';
import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';

export class BrandDataSourceImpl implements BrandDatasource {
  constructor(private readonly datasource: DataSource) {}

  async search(filter: IQueryFilter): Promise<Pagination<Brand>> {
    const { page, pageSize, filter: where } = filter;

    const [data, count] = await this.datasource.getRepository(Brand).findAndCount({
      where,
      select: {
        id: true,
        name: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data,
      count,
    };
  }
  async create(brand: CreateBrandDTO): Promise<Brand> {
    const brandEntity = this.datasource.getRepository(Brand).create(brand);
    return this.datasource.getRepository(Brand).save(brandEntity);
  }

  async update(id: number, brand: UpdateBrandDTO): Promise<Brand> {
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
