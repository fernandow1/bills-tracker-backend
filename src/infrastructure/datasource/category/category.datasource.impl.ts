import { CategoryDataSource } from '@domain/datasources/category.datasource';
import { CreateCategoryDTO } from '@application/dtos/category/create-category.dto';
import { DataSource } from 'typeorm';
import { Category } from '@infrastructure/database/entities/category.entity';
import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';
export class CategoryDataSourceImpl implements CategoryDataSource {
  constructor(private readonly datasource: DataSource) {}

  async search(filter: IQueryFilter): Promise<Pagination<Category>> {
    const { page, pageSize, filter: where } = filter;

    const [data, count] = await this.datasource.getRepository(Category).findAndCount({
      where,
      select: {
        id: true,
        name: true,
        description: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data,
      count,
    };
  }

  async updateCategory(id: number, category: Partial<CreateCategoryDTO>): Promise<Category> {
    const categoryToUpdate = await this.datasource
      .getRepository(Category)
      .findOneOrFail({ where: { id } });
    this.datasource.getRepository(Category).merge(categoryToUpdate, category);
    return this.datasource.getRepository(Category).save(categoryToUpdate);
  }

  async deleteCategory(id: number): Promise<void> {
    await this.datasource.getRepository(Category).softDelete(id);
  }

  async createCategory(category: CreateCategoryDTO): Promise<Category> {
    const categoryEntity = this.datasource.getRepository(Category).create(category);
    return this.datasource.getRepository(Category).save(categoryEntity);
  }

  async getAllCategories(): Promise<Category[]> {
    return this.datasource.getRepository(Category).find();
  }
}
