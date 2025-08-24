import { CategoryDataSource } from '@domain/datasources/category.datasource';
import { CreateCategoryDTO } from '@domain/dtos/category/create-category.dto';
import { Category } from '@domain/entities/category.entity';
import { CategoryRepository } from '@domain/repository/category.repository';

export class CategoryRepositoryImpl implements CategoryRepository {
  constructor(private readonly categoryDataSource: CategoryDataSource) {
    this.categoryDataSource = categoryDataSource;
  }

  createCategory(category: CreateCategoryDTO): Promise<Category> {
    return this.categoryDataSource.createCategory(category);
  }
  getAllCategories(): Promise<Category[]> {
    return this.categoryDataSource.getAllCategories();
  }
}
