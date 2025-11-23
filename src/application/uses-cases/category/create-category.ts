import { CreateCategoryDTO } from '@application/dtos/category/create-category.dto';
import { Category } from '@domain/entities/category.entity';
import { CategoryRepository } from '@domain/repository/category.repository';

export interface CreateCategoryUseCase {
  execute(category: CreateCategoryDTO): Promise<Category>;
}

export class CreateCategory implements CreateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(category: CreateCategoryDTO): Promise<Category> {
    return this.categoryRepository.createCategory(category);
  }
}
