import { ProductDataSourceImpl } from './product.datasource.impl';
import { Product } from '../../database/entities/product.entity';
import { BrandCategory } from '../../database/entities/brand-category.entity';
import { Repository, QueryRunner, DeleteResult, DataSource } from 'typeorm';
import {
  BRAND_CATEGORY_MOCK,
  createProductMock,
  createProductDTOMock,
  updateProductDTOMock,
  createMockedQueryRunner,
  createMockedProductRepository,
  MockedProductRepository,
  MockedQueryRunner,
} from './product.mock';

// Mock de DataSource de TypeORM
interface MockedDataSource {
  getRepository: jest.MockedFunction<(entity: typeof Product) => Repository<Product>>;
  createQueryRunner: jest.MockedFunction<() => QueryRunner>;
}

describe('ProductDataSourceImpl', () => {
  let productDataSource: ProductDataSourceImpl;
  let mockRepository: MockedProductRepository;
  let mockQueryRunner: MockedQueryRunner;
  let mockDataSource: MockedDataSource;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create fresh mock instances
    mockRepository = createMockedProductRepository();
    mockQueryRunner = createMockedQueryRunner();

    // Create mock DataSource
    mockDataSource = {
      getRepository: jest.fn(),
      createQueryRunner: jest.fn(),
    };

    // Setup DataSource mocks
    mockDataSource.getRepository.mockReturnValue(mockRepository as unknown as Repository<Product>);
    mockDataSource.createQueryRunner.mockReturnValue(mockQueryRunner as unknown as QueryRunner);

    // Create instance with injected DataSource
    productDataSource = new ProductDataSourceImpl(mockDataSource as unknown as DataSource);
  });

  describe('createProduct', () => {
    test('should create a product successfully', async () => {
      // Arrange
      const createProductDTO = createProductDTOMock();
      const expectedProduct = createProductMock({
        idBrand: createProductDTO.idBrand,
        idCategory: createProductDTO.idCategory,
        name: createProductDTO.name,
        description: createProductDTO.description,
      });
      const expectedBrandCategory = BRAND_CATEGORY_MOCK;

      mockQueryRunner.connect.mockResolvedValue();
      mockQueryRunner.startTransaction.mockResolvedValue();
      mockQueryRunner.commitTransaction.mockResolvedValue();
      mockQueryRunner.release.mockResolvedValue();
      mockQueryRunner.manager.upsert.mockResolvedValue(expectedBrandCategory);
      mockQueryRunner.manager.create.mockReturnValue(expectedProduct);
      mockQueryRunner.manager.save.mockResolvedValue(expectedProduct);

      // Act
      const result = await productDataSource.createProduct(createProductDTO);

      // Assert
      expect(mockQueryRunner.connect).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.startTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.manager.upsert).toHaveBeenCalledWith(
        BrandCategory,
        {
          idBrand: createProductDTO.idBrand,
          idCategory: createProductDTO.idCategory,
        },
        ['idBrand', 'idCategory'],
      );
      expect(mockQueryRunner.manager.create).toHaveBeenCalledWith(Product, createProductDTO);
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(expectedProduct);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedProduct);
    });

    test('should handle transaction rollback on BrandCategory upsert failure', async () => {
      // Arrange
      const createProductDTO = createProductDTOMock();

      mockQueryRunner.connect.mockResolvedValue();
      mockQueryRunner.startTransaction.mockResolvedValue();
      mockQueryRunner.rollbackTransaction.mockResolvedValue();
      mockQueryRunner.release.mockResolvedValue();
      mockQueryRunner.manager.upsert.mockResolvedValue(null as unknown as BrandCategory);

      // Act & Assert
      await expect(productDataSource.createProduct(createProductDTO)).rejects.toThrow(
        'BrandCategory save failed',
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
    });

    test('should handle transaction rollback on product save failure', async () => {
      // Arrange
      const createProductDTO = createProductDTOMock();
      const expectedBrandCategory = BRAND_CATEGORY_MOCK;
      const expectedProduct = createProductMock();
      const saveError = new Error('Product save failed');

      mockQueryRunner.connect.mockResolvedValue();
      mockQueryRunner.startTransaction.mockResolvedValue();
      mockQueryRunner.rollbackTransaction.mockResolvedValue();
      mockQueryRunner.release.mockResolvedValue();
      mockQueryRunner.manager.upsert.mockResolvedValue(expectedBrandCategory);
      mockQueryRunner.manager.create.mockReturnValue(expectedProduct);
      mockQueryRunner.manager.save.mockRejectedValue(saveError);

      // Act & Assert
      await expect(productDataSource.createProduct(createProductDTO)).rejects.toThrow(saveError);

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProductById', () => {
    test('should return a product when found', async () => {
      // Arrange
      const productId = 1;
      const expectedProduct = createProductMock({ id: productId });

      mockRepository.findOneByOrFail.mockResolvedValue(expectedProduct);

      // Act
      const result = await productDataSource.getProductById(productId);

      // Assert
      expect(mockRepository.findOneByOrFail).toHaveBeenCalledWith({ id: productId });
      expect(result).toEqual(expectedProduct);
    });

    test('should throw error when product not found', async () => {
      // Arrange
      const productId = 999;
      const notFoundError = new Error('Product not found');

      mockRepository.findOneByOrFail.mockRejectedValue(notFoundError);

      // Act & Assert
      await expect(productDataSource.getProductById(productId)).rejects.toThrow(notFoundError);
      expect(mockRepository.findOneByOrFail).toHaveBeenCalledWith({ id: productId });
    });
  });

  describe('getAllProducts', () => {
    test('should return all products', async () => {
      // Arrange
      const expectedProducts = [
        createProductMock({ id: 1 }),
        createProductMock({ id: 2 }),
        createProductMock({ id: 3 }),
      ];

      mockRepository.find.mockResolvedValue(expectedProducts);

      // Act
      const result = await productDataSource.getAllProducts();

      // Assert
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedProducts);
    });

    test('should return empty array when no products exist', async () => {
      // Arrange
      const expectedProducts: Product[] = [];

      mockRepository.find.mockResolvedValue(expectedProducts);

      // Act
      const result = await productDataSource.getAllProducts();

      // Assert
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedProducts);
    });
  });

  describe('updateProduct', () => {
    test('should update a product successfully with brand and category', async () => {
      // Arrange
      const productId = 1;
      const updateProductDTO = updateProductDTOMock();
      const existingProduct = createProductMock({ id: productId });
      const mergedProduct = createProductMock({
        ...existingProduct,
        ...updateProductDTO,
      });
      const expectedBrandCategory = BRAND_CATEGORY_MOCK;

      mockQueryRunner.connect.mockResolvedValue();
      mockQueryRunner.startTransaction.mockResolvedValue();
      mockQueryRunner.commitTransaction.mockResolvedValue();
      mockQueryRunner.release.mockResolvedValue();
      mockQueryRunner.manager.findOneOrFail.mockResolvedValue(existingProduct);
      mockQueryRunner.manager.upsert.mockResolvedValue(expectedBrandCategory);
      mockQueryRunner.manager.merge.mockReturnValue(mergedProduct);
      mockQueryRunner.manager.save.mockResolvedValue(mergedProduct);

      // Act
      const result = await productDataSource.updateProduct(productId, updateProductDTO);

      // Assert
      expect(mockQueryRunner.manager.findOneOrFail).toHaveBeenCalledWith(Product, {
        where: { id: productId },
      });
      expect(mockQueryRunner.manager.upsert).toHaveBeenCalledWith(
        BrandCategory,
        {
          idBrand: updateProductDTO.idBrand,
          idCategory: updateProductDTO.idCategory,
        },
        ['idBrand', 'idCategory'],
      );
      expect(mockQueryRunner.manager.merge).toHaveBeenCalledWith(
        Product,
        existingProduct,
        updateProductDTO,
      );
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(mergedProduct);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mergedProduct);
    });

    test('should update a product successfully without brand and category', async () => {
      // Arrange
      const productId = 1;
      const updateProductDTO = updateProductDTOMock({
        idBrand: undefined,
        idCategory: undefined,
        name: 'Updated Product Name',
      });
      const existingProduct = createProductMock({ id: productId });
      const mergedProduct = createProductMock({
        ...existingProduct,
        name: updateProductDTO.name,
      });

      mockQueryRunner.connect.mockResolvedValue();
      mockQueryRunner.startTransaction.mockResolvedValue();
      mockQueryRunner.commitTransaction.mockResolvedValue();
      mockQueryRunner.release.mockResolvedValue();
      mockQueryRunner.manager.findOneOrFail.mockResolvedValue(existingProduct);
      mockQueryRunner.manager.merge.mockReturnValue(mergedProduct);
      mockQueryRunner.manager.save.mockResolvedValue(mergedProduct);

      // Act
      const result = await productDataSource.updateProduct(productId, updateProductDTO);

      // Assert
      expect(mockQueryRunner.manager.findOneOrFail).toHaveBeenCalledWith(Product, {
        where: { id: productId },
      });
      expect(mockQueryRunner.manager.upsert).not.toHaveBeenCalled();
      expect(mockQueryRunner.manager.merge).toHaveBeenCalledWith(
        Product,
        existingProduct,
        updateProductDTO,
      );
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(mergedProduct);
      expect(result).toEqual(mergedProduct);
    });

    test('should throw error when only idBrand is provided without idCategory', async () => {
      // Arrange
      const productId = 1;
      const updateProductDTO = updateProductDTOMock({
        idBrand: 1,
        idCategory: undefined,
      });
      const existingProduct = createProductMock({ id: productId });

      mockQueryRunner.connect.mockResolvedValue();
      mockQueryRunner.startTransaction.mockResolvedValue();
      mockQueryRunner.rollbackTransaction.mockResolvedValue();
      mockQueryRunner.release.mockResolvedValue();
      mockQueryRunner.manager.findOneOrFail.mockResolvedValue(existingProduct);

      // Act & Assert
      await expect(productDataSource.updateProduct(productId, updateProductDTO)).rejects.toThrow(
        'Both idBrand and idCategory must be provided',
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
    });

    test('should throw error when only idCategory is provided without idBrand', async () => {
      // Arrange
      const productId = 1;
      const updateProductDTO = updateProductDTOMock({
        idBrand: undefined,
        idCategory: 1,
      });
      const existingProduct = createProductMock({ id: productId });

      mockQueryRunner.connect.mockResolvedValue();
      mockQueryRunner.startTransaction.mockResolvedValue();
      mockQueryRunner.rollbackTransaction.mockResolvedValue();
      mockQueryRunner.release.mockResolvedValue();
      mockQueryRunner.manager.findOneOrFail.mockResolvedValue(existingProduct);

      // Act & Assert
      await expect(productDataSource.updateProduct(productId, updateProductDTO)).rejects.toThrow(
        'Both idBrand and idCategory must be provided',
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
    });

    test('should handle transaction rollback on product not found', async () => {
      // Arrange
      const productId = 999;
      const updateProductDTO = updateProductDTOMock();
      const notFoundError = new Error('Product not found');

      mockQueryRunner.connect.mockResolvedValue();
      mockQueryRunner.startTransaction.mockResolvedValue();
      mockQueryRunner.rollbackTransaction.mockResolvedValue();
      mockQueryRunner.release.mockResolvedValue();
      mockQueryRunner.manager.findOneOrFail.mockRejectedValue(notFoundError);

      // Act & Assert
      await expect(productDataSource.updateProduct(productId, updateProductDTO)).rejects.toThrow(
        notFoundError,
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
    });

    test('should handle transaction rollback on BrandCategory upsert failure', async () => {
      // Arrange
      const productId = 1;
      const updateProductDTO = updateProductDTOMock();
      const existingProduct = createProductMock({ id: productId });

      mockQueryRunner.connect.mockResolvedValue();
      mockQueryRunner.startTransaction.mockResolvedValue();
      mockQueryRunner.rollbackTransaction.mockResolvedValue();
      mockQueryRunner.release.mockResolvedValue();
      mockQueryRunner.manager.findOneOrFail.mockResolvedValue(existingProduct);
      mockQueryRunner.manager.upsert.mockResolvedValue(null as unknown as BrandCategory);

      // Act & Assert
      await expect(productDataSource.updateProduct(productId, updateProductDTO)).rejects.toThrow(
        'BrandCategory save failed',
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
    });
  });

  describe('deleteProduct', () => {
    test('should delete a product successfully', async () => {
      // Arrange
      const productId = 1;
      const existingProduct = createProductMock({ id: productId });
      const deleteResult = { affected: 1, raw: {} };

      mockRepository.findOneOrFail.mockResolvedValue(existingProduct);
      mockRepository.softDelete.mockResolvedValue(deleteResult as DeleteResult);

      // Act
      await productDataSource.deleteProduct(productId);

      // Assert
      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id: productId } });
      expect(mockRepository.softDelete).toHaveBeenCalledWith(productId);
    });

    test('should throw error when product to delete is not found', async () => {
      // Arrange
      const productId = 999;
      const notFoundError = new Error('Product not found');

      mockRepository.findOneOrFail.mockRejectedValue(notFoundError);

      // Act & Assert
      await expect(productDataSource.deleteProduct(productId)).rejects.toThrow(notFoundError);

      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id: productId } });
      expect(mockRepository.softDelete).not.toHaveBeenCalled();
    });
  });
});
