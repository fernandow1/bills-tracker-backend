import { CreateCategoryDTO } from '@domain/dtos/category/create-category.dto';
import { Category } from '@domain/entities/category.entity';

export abstract class CategoryDataSource {
  abstract createCategory(category: CreateCategoryDTO): Promise<Category>;
  abstract getAllCategories(): Promise<Category[]>;
}
