import { BrandRepositoryImpl } from './brand.repository.impl';
import { BrandDatasource } from '../../../domain/datasources/brand.datasource';
import {
  createBrandMock,
  createBrandDTOMock,
  brandDataSourceDomainMock,
} from '../../datasource/brand/brand.mock';

describe('BrandRepositoryImpl', () => {
  let brandRepository: BrandRepositoryImpl;
  let mockDatasource: jest.Mocked<BrandDatasource>;

  beforeEach(() => {
    mockDatasource = brandDataSourceDomainMock();
    brandRepository = new BrandRepositoryImpl(mockDatasource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    test('should create a brand successfully', async () => {
      // Arrange
      const createBrandDto = createBrandDTOMock({ name: 'Nike' });
      const expectedBrand = createBrandMock({ name: 'Nike' });

      mockDatasource.create.mockResolvedValue(expectedBrand);

      // Act
      const result = await brandRepository.create(createBrandDto);

      // Assert
      expect(mockDatasource.create).toHaveBeenCalledWith(createBrandDto);
      expect(result).toEqual(expectedBrand);
    });

    test('should handle datasource errors during creation', async () => {
      // Arrange
      const createBrandDto = createBrandDTOMock();
      const error = new Error('Datasource creation failed');

      mockDatasource.create.mockRejectedValue(error);

      // Act & Assert
      await expect(brandRepository.create(createBrandDto)).rejects.toThrow(
        'Datasource creation failed',
      );
      expect(mockDatasource.create).toHaveBeenCalledWith(createBrandDto);
    });
  });

  describe('findAll', () => {
    test('should retrieve all brands', async () => {
      // Arrange
      const expectedBrands = [
        createBrandMock({ id: 1, name: 'Nike' }),
        createBrandMock({ id: 2, name: 'Adidas' }),
      ];

      mockDatasource.findAll.mockResolvedValue(expectedBrands);

      // Act
      const result = await brandRepository.findAll();

      // Assert
      expect(mockDatasource.findAll).toHaveBeenCalledWith();
      expect(result).toEqual(expectedBrands);
    });

    test('should return empty array when no brands exist', async () => {
      // Arrange
      mockDatasource.findAll.mockResolvedValue([]);

      // Act
      const result = await brandRepository.findAll();

      // Assert
      expect(result).toEqual([]);
      expect(mockDatasource.findAll).toHaveBeenCalledTimes(1);
    });

    test('should handle datasource errors during find all', async () => {
      // Arrange
      const error = new Error('Datasource query failed');
      mockDatasource.findAll.mockRejectedValue(error);

      // Act & Assert
      await expect(brandRepository.findAll()).rejects.toThrow('Datasource query failed');
    });
  });

  describe('update', () => {
    test('should update a brand successfully', async () => {
      // Arrange
      const brandId = 1;
      const updateDto = createBrandDTOMock({ name: 'Updated Nike' });
      const updatedBrand = createBrandMock({ id: brandId, name: 'Updated Nike' });

      mockDatasource.update.mockResolvedValue(updatedBrand);

      // Act
      const result = await brandRepository.update(brandId, updateDto);

      // Assert
      expect(mockDatasource.update).toHaveBeenCalledWith(brandId, updateDto);
      expect(result).toEqual(updatedBrand);
    });

    test('should handle brand not found during update', async () => {
      // Arrange
      const brandId = 999;
      const updateDto = createBrandDTOMock();
      const error = new Error('Brand not found');

      mockDatasource.update.mockRejectedValue(error);

      // Act & Assert
      await expect(brandRepository.update(brandId, updateDto)).rejects.toThrow('Brand not found');
      expect(mockDatasource.update).toHaveBeenCalledWith(brandId, updateDto);
    });

    test('should handle datasource errors during update', async () => {
      // Arrange
      const brandId = 1;
      const updateDto = createBrandDTOMock();
      const error = new Error('Datasource update failed');

      mockDatasource.update.mockRejectedValue(error);

      // Act & Assert
      await expect(brandRepository.update(brandId, updateDto)).rejects.toThrow(
        'Datasource update failed',
      );
    });
  });

  describe('delete', () => {
    test('should delete a brand successfully', async () => {
      // Arrange
      const brandId = 1;

      mockDatasource.delete.mockResolvedValue();

      // Act
      await brandRepository.delete(brandId);

      // Assert
      expect(mockDatasource.delete).toHaveBeenCalledWith(brandId);
    });

    test('should handle deletion when brand does not exist', async () => {
      // Arrange
      const brandId = 999;

      mockDatasource.delete.mockResolvedValue();

      // Act & Assert
      await expect(brandRepository.delete(brandId)).resolves.toBeUndefined();
      expect(mockDatasource.delete).toHaveBeenCalledWith(brandId);
    });

    test('should handle datasource errors during deletion', async () => {
      // Arrange
      const brandId = 1;
      const error = new Error('Datasource deletion failed');

      mockDatasource.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(brandRepository.delete(brandId)).rejects.toThrow('Datasource deletion failed');
    });
  });
});
