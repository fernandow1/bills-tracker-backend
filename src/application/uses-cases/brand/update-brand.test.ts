import { UpdateBrand } from './update-brand';
import { BrandRepository } from '../../../domain/repository/brand.repository';
import {
  BRAND_MOCK,
  createBrandMock,
  updateBrandDTOMock,
  brandRepositoryDomainMock,
} from '../../../infrastructure/datasource/brand/brand.mock';

describe('UpdateBrand Use Case', () => {
  let updateBrandUseCase: UpdateBrand;
  let mockBrandRepository: jest.Mocked<BrandRepository>;

  beforeEach(() => {
    mockBrandRepository = brandRepositoryDomainMock();
    updateBrandUseCase = new UpdateBrand(mockBrandRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    test('should update an existing brand successfully', async () => {
      // Arrange
      const brandId = 1;
      const updateBrandDto = updateBrandDTOMock({ name: 'Updated Nike' });
      const updatedBrand = createBrandMock({
        id: brandId,
        name: 'Updated Nike',
        updatedAt: new Date(),
      });

      mockBrandRepository.update.mockResolvedValue(updatedBrand);

      // Act
      const result = await updateBrandUseCase.execute(brandId, updateBrandDto);

      // Assert
      expect(mockBrandRepository.update).toHaveBeenCalledTimes(1);
      expect(mockBrandRepository.update).toHaveBeenCalledWith(brandId, updateBrandDto);
      expect(result).toEqual(updatedBrand);
      expect(result.name).toBe('Updated Nike');
    });

    test('should update brand with partial data', async () => {
      // Arrange
      const brandId = 2;
      const updateBrandDto = updateBrandDTOMock({ name: 'Partial Update' });
      const existingBrand = { ...BRAND_MOCK, id: brandId };
      const updatedBrand = { ...existingBrand, name: 'Partial Update' };

      mockBrandRepository.update.mockResolvedValue(updatedBrand);

      // Act
      const result = await updateBrandUseCase.execute(brandId, updateBrandDto);

      // Assert
      expect(result.id).toBe(brandId);
      expect(result.name).toBe('Partial Update');
      expect(result.createdAt).toEqual(existingBrand.createdAt);
    });

    test('should handle repository errors during update', async () => {
      // Arrange
      const brandId = 999;
      const updateBrandDto = updateBrandDTOMock({ name: 'Error Brand' });
      const error = new Error('Brand not found');

      mockBrandRepository.update.mockRejectedValue(error);

      // Act & Assert
      await expect(updateBrandUseCase.execute(brandId, updateBrandDto)).rejects.toThrow(
        'Brand not found',
      );
      expect(mockBrandRepository.update).toHaveBeenCalledWith(brandId, updateBrandDto);
    });

    test('should preserve original properties when updating', async () => {
      // Arrange
      const brandId = 3;
      const updateBrandDto = updateBrandDTOMock({ name: 'New Name' });
      const originalBrand = createBrandMock({
        id: brandId,
        name: 'Original Name',
        createdAt: new Date('2022-01-01'),
      });
      const updatedBrand = {
        ...originalBrand,
        name: 'New Name',
        updatedAt: new Date(),
      };

      mockBrandRepository.update.mockResolvedValue(updatedBrand);

      // Act
      const result = await updateBrandUseCase.execute(brandId, updateBrandDto);

      // Assert
      expect(result.id).toBe(originalBrand.id);
      expect(result.createdAt).toEqual(originalBrand.createdAt);
      expect(result.name).toBe('New Name');
      expect(result.deletedAt).toBeNull();
    });
  });
});
