import { GetBrands } from './get-brands';
import { BrandRepository } from '../../../domain/repository/brand.repository';
import {
  BRAND_MOCK,
  createBrandMock,
  brandRepositoryDomainMock,
} from '../../../infrastructure/datasource/brand/brand.mock';

describe('GetBrands Use Case', () => {
  let getBrandsUseCase: GetBrands;
  let mockBrandRepository: jest.Mocked<BrandRepository>;

  beforeEach(() => {
    mockBrandRepository = brandRepositoryDomainMock();
    getBrandsUseCase = new GetBrands(mockBrandRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    test('should retrieve all brands successfully', async () => {
      // Arrange
      const expectedBrands = [
        createBrandMock({ id: 1, name: 'Nike' }),
        createBrandMock({ id: 2, name: 'Adidas' }),
        createBrandMock({ id: 3, name: 'Puma' }),
      ];

      mockBrandRepository.findAll.mockResolvedValue(expectedBrands);

      // Act
      const result = await getBrandsUseCase.execute();

      // Assert
      expect(mockBrandRepository.findAll).toHaveBeenCalledTimes(1);
      expect(mockBrandRepository.findAll).toHaveBeenCalledWith();
      expect(result).toEqual(expectedBrands);
      expect(result).toHaveLength(3);
    });

    test('should return empty array when no brands exist', async () => {
      // Arrange
      mockBrandRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await getBrandsUseCase.execute();

      // Assert
      expect(mockBrandRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    test('should return single brand correctly', async () => {
      // Arrange
      const singleBrand = [BRAND_MOCK];
      mockBrandRepository.findAll.mockResolvedValue(singleBrand);

      // Act
      const result = await getBrandsUseCase.execute();

      // Assert
      expect(result).toEqual(singleBrand);
      expect(result[0]).toHaveProperty('id', BRAND_MOCK.id);
      expect(result[0]).toHaveProperty('name', BRAND_MOCK.name);
    });

    test('should handle repository errors', async () => {
      // Arrange
      const error = new Error('Repository connection failed');
      mockBrandRepository.findAll.mockRejectedValue(error);

      // Act & Assert
      await expect(getBrandsUseCase.execute()).rejects.toThrow('Repository connection failed');
      expect(mockBrandRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
