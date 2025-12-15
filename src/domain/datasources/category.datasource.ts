import { CreateCategoryDTO } from '@application/dtos/category/create-category.dto';
import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';
import { Category } from '@domain/entities/category.entity';

export abstract class CategoryDataSource {
  abstract search(filter: IQueryFilter): Promise<Pagination<Category>>;
  abstract createCategory(category: CreateCategoryDTO): Promise<Category>;
  abstract getAllCategories(): Promise<Category[]>;
  abstract updateCategory(id: number, category: Partial<CreateCategoryDTO>): Promise<Category>;
  abstract deleteCategory(id: number): Promise<void>;
}
