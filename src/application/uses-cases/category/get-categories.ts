import { Category } from '@domain/entities/category.entity';
import { CategoryRepository } from '@domain/repository/category.repository';

export interface GetCategoriesUseCase {
  execute(): Promise<Category[]>;
}

export class GetCategories implements GetCategoriesUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(): Promise<Category[]> {
    return this.categoryRepository.getAllCategories();
  }
}
