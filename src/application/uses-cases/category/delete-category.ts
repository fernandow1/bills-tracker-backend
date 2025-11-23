import { CategoryRepository } from '@domain/repository/category.repository';

export interface DeleteCategoryUseCase {
  execute(id: number): Promise<void>;
}

export class DeleteCategory implements DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}
  async execute(id: number): Promise<void> {
    return this.categoryRepository.deleteCategory(id);
  }
}
