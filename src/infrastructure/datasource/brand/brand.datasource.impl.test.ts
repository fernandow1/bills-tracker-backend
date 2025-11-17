import { BrandDataSourceImpl } from './brand.datasource.impl';
import { DataSource } from 'typeorm';
import { Brand } from '../../database/entities/brand.entity';
import {
  createBrandMock,
  createBrandDTOMock,
  brandTypeOrmRepositoryMock,
  typeOrmDataSourceMock,
} from './brand.mock';

describe('BrandDataSourceImpl', () => {
  let brandDataSource: BrandDataSourceImpl;
  let mockDataSource: DataSource;
  let mockRepository: ReturnType<typeof brandTypeOrmRepositoryMock>;

  beforeEach(() => {
    mockRepository = brandTypeOrmRepositoryMock();
    mockDataSource = typeOrmDataSourceMock() as unknown as DataSource;
    (mockDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

    brandDataSource = new BrandDataSourceImpl(mockDataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    test('should create a brand successfully', async () => {
      // Arrange
      const createBrandDto = createBrandDTOMock({ name: 'Nike' });
      const expectedBrand = createBrandMock({ name: 'Nike' });

      mockRepository.create.mockReturnValue(expectedBrand);
      mockRepository.save.mockResolvedValue(expectedBrand);

      // Act
      const result = await brandDataSource.create(createBrandDto);

      // Assert
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(Brand);
      expect(mockRepository.create).toHaveBeenCalledWith(createBrandDto);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedBrand);
      expect(result).toEqual(expectedBrand);
    });

    test('should handle repository errors during creation', async () => {
      // Arrange
      const createBrandDto = createBrandDTOMock();
      const error = new Error('Database connection failed');

      mockRepository.create.mockReturnValue({});
      mockRepository.save.mockRejectedValue(error);

      // Act & Assert
      await expect(brandDataSource.create(createBrandDto)).rejects.toThrow(
        'Database connection failed',
      );
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(Brand);
    });
  });

  describe('findAll', () => {
    test('should retrieve all brands', async () => {
      // Arrange
      const expectedBrands = [
        createBrandMock({ id: 1, name: 'Nike' }),
        createBrandMock({ id: 2, name: 'Adidas' }),
      ];

      mockRepository.find.mockResolvedValue(expectedBrands);

      // Act
      const result = await brandDataSource.findAll();

      // Assert
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(Brand);
      expect(mockRepository.find).toHaveBeenCalledWith();
      expect(result).toEqual(expectedBrands);
    });

    test('should return empty array when no brands exist', async () => {
      // Arrange
      mockRepository.find.mockResolvedValue([]);

      // Act
      const result = await brandDataSource.findAll();

      // Assert
      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    test('should handle repository errors during find all', async () => {
      // Arrange
      const error = new Error('Database query failed');
      mockRepository.find.mockRejectedValue(error);

      // Act & Assert
      await expect(brandDataSource.findAll()).rejects.toThrow('Database query failed');
    });
  });

  describe('update', () => {
    test('should update a brand successfully', async () => {
      // Arrange
      const brandId = 1;
      const updateDto = createBrandDTOMock({ name: 'Updated Nike' });
      const existingBrand = createBrandMock({ id: brandId, name: 'Nike' });

      mockRepository.findOneOrFail.mockResolvedValue(existingBrand);
      mockRepository.merge.mockImplementation((entity, dto) => {
        Object.assign(entity, dto);
        return entity;
      });
      mockRepository.save.mockImplementation((entity) => Promise.resolve(entity));

      // Act
      const result = await brandDataSource.update(brandId, updateDto);

      // Assert
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(Brand);
      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id: brandId } });
      expect(mockRepository.merge).toHaveBeenCalledWith(existingBrand, updateDto);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.id).toBe(brandId);
      expect(result.name).toBe('Updated Nike');
    });

    test('should handle brand not found during update', async () => {
      // Arrange
      const brandId = 999;
      const updateDto = createBrandDTOMock();
      const error = new Error('Entity not found');

      mockRepository.findOneOrFail.mockRejectedValue(error);

      // Act & Assert
      await expect(brandDataSource.update(brandId, updateDto)).rejects.toThrow('Entity not found');
      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id: brandId } });
      expect(mockRepository.merge).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    test('should soft delete a brand successfully', async () => {
      // Arrange
      const brandId = 1;

      mockRepository.softDelete.mockResolvedValue({ affected: 1 });

      // Act
      await brandDataSource.delete(brandId);

      // Assert
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(Brand);
      expect(mockRepository.softDelete).toHaveBeenCalledWith(brandId);
    });

    test('should handle deletion when brand does not exist', async () => {
      // Arrange
      const brandId = 999;

      mockRepository.softDelete.mockResolvedValue({ affected: 0 });

      // Act & Assert
      await expect(brandDataSource.delete(brandId)).resolves.toBeUndefined();
      expect(mockRepository.softDelete).toHaveBeenCalledWith(brandId);
    });

    test('should handle repository errors during deletion', async () => {
      // Arrange
      const brandId = 1;
      const error = new Error('Database deletion failed');

      mockRepository.softDelete.mockRejectedValue(error);

      // Act & Assert
      await expect(brandDataSource.delete(brandId)).rejects.toThrow('Database deletion failed');
    });
  });
});
