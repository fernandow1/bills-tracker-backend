import { CategoryDataSource } from '@domain/datasources/category.datasource';
import { CreateCategoryDTO } from '@application/dtos/category/create-category.dto';
import { Category } from '@domain/entities/category.entity';
import { CategoryRepository } from '@domain/repository/category.repository';

export class CategoryRepositoryImpl implements CategoryRepository {
  constructor(private readonly categoryDataSource: CategoryDataSource) {
    this.categoryDataSource = categoryDataSource;
  }

  createCategory(category: CreateCategoryDTO): Promise<Category> {
    return this.categoryDataSource.createCategory(category);
  }

  updateCategory(id: number, category: Partial<CreateCategoryDTO>): Promise<Category> {
    return this.categoryDataSource.updateCategory(id, category);
  }

  getAllCategories(): Promise<Category[]> {
    return this.categoryDataSource.getAllCategories();
  }

  deleteCategory(id: number): Promise<void> {
    return this.categoryDataSource.deleteCategory(id);
  }
}
