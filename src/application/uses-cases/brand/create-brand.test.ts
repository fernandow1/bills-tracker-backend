import { CreateBrand } from './create-brand';
import { BrandRepository } from '../../../domain/repository/brand.repository';
import {
  BRAND_MOCK,
  createBrandMock,
  createBrandDTOMock,
  brandRepositoryDomainMock,
} from '../../../infrastructure/datasource/brand/brand.mock';

describe('CreateBrand Use Case', () => {
  let createBrandUseCase: CreateBrand;
  let mockBrandRepository: jest.Mocked<BrandRepository>;

  beforeEach(() => {
    mockBrandRepository = brandRepositoryDomainMock();
    createBrandUseCase = new CreateBrand(mockBrandRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    test('should create a new brand successfully', async () => {
      // Arrange
      const createBrandDto = createBrandDTOMock({ name: 'Adidas' });
      const expectedBrand = createBrandMock({ id: 1, name: 'Adidas' });

      mockBrandRepository.create.mockResolvedValue(expectedBrand);

      // Act
      const result = await createBrandUseCase.execute(createBrandDto);

      // Assert
      expect(mockBrandRepository.create).toHaveBeenCalledTimes(1);
      expect(mockBrandRepository.create).toHaveBeenCalledWith(createBrandDto);
      expect(result).toEqual(expectedBrand);
      expect(result.name).toBe('Adidas');
    });

    test('should create a brand with valid data structure', async () => {
      // Arrange
      const createBrandDto = createBrandDTOMock({ name: 'Puma' });
      const expectedBrand = { ...BRAND_MOCK, name: 'Puma', id: 2 };

      mockBrandRepository.create.mockResolvedValue(expectedBrand);

      // Act
      const result = await createBrandUseCase.execute(createBrandDto);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name', 'Puma');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect(result).toHaveProperty('deletedAt', null);
    });

    test('should handle repository errors', async () => {
      // Arrange
      const createBrandDto = createBrandDTOMock({ name: 'Error Brand' });
      const error = new Error('Repository error');

      mockBrandRepository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(createBrandUseCase.execute(createBrandDto)).rejects.toThrow('Repository error');
      expect(mockBrandRepository.create).toHaveBeenCalledWith(createBrandDto);
    });
  });
});
