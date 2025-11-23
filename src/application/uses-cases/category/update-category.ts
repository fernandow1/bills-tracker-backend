import { UpdateCategoryDTO } from '@application/dtos/category/update-category.dto';
import { Category } from '@domain/entities/category.entity';
import { CategoryRepository } from '@domain/repository/category.repository';

export interface UpdateCategoryUseCase {
  execute(id: number, updateCategoryDTO: UpdateCategoryDTO): Promise<Category>;
}

export class UpdateCategory implements UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: number, updateCategoryDTO: UpdateCategoryDTO): Promise<Category> {
    return this.categoryRepository.updateCategory(id, updateCategoryDTO);
  }
}
