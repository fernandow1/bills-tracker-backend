import { CreateCategoryDTO } from '@application/dtos/category/create-category.dto';
import { Category } from '@domain/entities/category.entity';

export abstract class CategoryRepository {
  abstract createCategory(category: CreateCategoryDTO): Promise<Category>;
  abstract getAllCategories(): Promise<Category[]>;
}
