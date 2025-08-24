import { CategoryDataSource } from '@domain/datasources/category.datasource';
import { CreateCategoryDTO } from '@domain/dtos/category/create-category.dto';
import { Category } from '@infrastructure/database/entities/category.entity';
import { AppDataSource } from '@infrastructure/database/connection';

export class CategoryDataSourceImpl implements CategoryDataSource {
  createCategory(category: CreateCategoryDTO): Promise<Category> {
    return AppDataSource.getRepository(Category).save(category);
  }
  getAllCategories(): Promise<Category[]> {
    return AppDataSource.getRepository(Category).find();
  }
}
