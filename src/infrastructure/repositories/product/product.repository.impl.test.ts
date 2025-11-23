import { ProductRepositoryImpl } from './product.repository.impl';
import {
  createProductMock,
  createProductDTOMock,
  updateProductDTOMock,
  createMockedProductDataSource,
  MockedProductDataSource,
} from '../../datasource/product/product.mock';
import { Product } from '../../../domain/entities/product.entity';
import { UpdateProductDTO } from '../../../application/dtos/product/update-product.dto';

describe('ProductRepositoryImpl', () => {
  let productRepository: ProductRepositoryImpl;
  let mockDataSource: MockedProductDataSource;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create fresh mock instance
    mockDataSource = createMockedProductDataSource();

    // Create repository instance with mocked datasource
    productRepository = new ProductRepositoryImpl(mockDataSource);
  });

  describe('createProduct', () => {
    test('should delegate to datasource and return created product', async () => {
      // Arrange
      const createProductDTO = createProductDTOMock();
      const expectedProduct = createProductMock({
        idBrand: createProductDTO.idBrand,
        idCategory: createProductDTO.idCategory,
        name: createProductDTO.name,
        description: createProductDTO.description,
      });

      mockDataSource.createProduct.mockResolvedValue(expectedProduct);

      // Act
      const result = await productRepository.createProduct(createProductDTO);

      // Assert
      expect(mockDataSource.createProduct).toHaveBeenCalledTimes(1);
      expect(mockDataSource.createProduct).toHaveBeenCalledWith(createProductDTO);
      expect(result).toEqual(expectedProduct);
    });

    test('should propagate error from datasource', async () => {
      // Arrange
      const createProductDTO = createProductDTOMock();
      const expectedError = new Error('DataSource creation failed');

      mockDataSource.createProduct.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(productRepository.createProduct(createProductDTO)).rejects.toThrow(
        expectedError,
      );
      expect(mockDataSource.createProduct).toHaveBeenCalledWith(createProductDTO);
    });
  });

  describe('getProductById', () => {
    test('should delegate to datasource and return product', async () => {
      // Arrange
      const productId = 1;
      const expectedProduct = createProductMock({ id: productId });

      mockDataSource.getProductById.mockResolvedValue(expectedProduct);

      // Act
      const result = await productRepository.getProductById(productId);

      // Assert
      expect(mockDataSource.getProductById).toHaveBeenCalledTimes(1);
      expect(mockDataSource.getProductById).toHaveBeenCalledWith(productId);
      expect(result).toEqual(expectedProduct);
    });

    test('should propagate error from datasource when product not found', async () => {
      // Arrange
      const productId = 999;
      const expectedError = new Error('Product not found');

      mockDataSource.getProductById.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(productRepository.getProductById(productId)).rejects.toThrow(expectedError);
      expect(mockDataSource.getProductById).toHaveBeenCalledWith(productId);
    });
  });

  describe('getAllProducts', () => {
    test('should delegate to datasource and return all products', async () => {
      // Arrange
      const expectedProducts = [
        createProductMock({ id: 1 }),
        createProductMock({ id: 2 }),
        createProductMock({ id: 3 }),
      ];

      mockDataSource.getAllProducts.mockResolvedValue(expectedProducts);

      // Act
      const result = await productRepository.getAllProducts();

      // Assert
      expect(mockDataSource.getAllProducts).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedProducts);
    });

    test('should delegate to datasource and return empty array when no products', async () => {
      // Arrange
      const expectedProducts: Product[] = [];

      mockDataSource.getAllProducts.mockResolvedValue(expectedProducts);

      // Act
      const result = await productRepository.getAllProducts();

      // Assert
      expect(mockDataSource.getAllProducts).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedProducts);
    });

    test('should propagate error from datasource', async () => {
      // Arrange
      const expectedError = new Error('DataSource error');

      mockDataSource.getAllProducts.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(productRepository.getAllProducts()).rejects.toThrow(expectedError);
      expect(mockDataSource.getAllProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateProduct', () => {
    test('should delegate to datasource and return updated product', async () => {
      // Arrange
      const productId = 1;
      const updateProductDTO = updateProductDTOMock();
      const expectedUpdatedProduct = createProductMock({
        id: productId,
        ...updateProductDTO,
      });

      mockDataSource.updateProduct.mockResolvedValue(expectedUpdatedProduct as UpdateProductDTO);

      // Act
      const result = await productRepository.updateProduct(productId, updateProductDTO);

      // Assert
      expect(mockDataSource.updateProduct).toHaveBeenCalledTimes(1);
      expect(mockDataSource.updateProduct).toHaveBeenCalledWith(productId, updateProductDTO);
      expect(result).toEqual(expectedUpdatedProduct);
    });

    test('should delegate to datasource with partial update data', async () => {
      // Arrange
      const productId = 1;
      const partialUpdateDTO = updateProductDTOMock({
        name: 'Updated Product Name',
        idBrand: undefined,
        idCategory: undefined,
      });
      const expectedUpdatedProduct = createProductMock({
        id: productId,
        name: partialUpdateDTO.name,
      });

      mockDataSource.updateProduct.mockResolvedValue(expectedUpdatedProduct as UpdateProductDTO);

      // Act
      const result = await productRepository.updateProduct(productId, partialUpdateDTO);

      // Assert
      expect(mockDataSource.updateProduct).toHaveBeenCalledWith(productId, partialUpdateDTO);
      expect(result).toEqual(expectedUpdatedProduct);
    });

    test('should propagate error from datasource when product not found', async () => {
      // Arrange
      const productId = 999;
      const updateProductDTO = updateProductDTOMock();
      const expectedError = new Error('Product not found');

      mockDataSource.updateProduct.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(productRepository.updateProduct(productId, updateProductDTO)).rejects.toThrow(
        expectedError,
      );
      expect(mockDataSource.updateProduct).toHaveBeenCalledWith(productId, updateProductDTO);
    });

    test('should propagate validation error from datasource', async () => {
      // Arrange
      const productId = 1;
      const invalidUpdateDTO = updateProductDTOMock({
        idBrand: 1,
        idCategory: undefined, // Invalid: should provide both or none
      });
      const expectedError = new Error('Both idBrand and idCategory must be provided');

      mockDataSource.updateProduct.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(productRepository.updateProduct(productId, invalidUpdateDTO)).rejects.toThrow(
        expectedError,
      );
      expect(mockDataSource.updateProduct).toHaveBeenCalledWith(productId, invalidUpdateDTO);
    });
  });

  describe('deleteProduct', () => {
    test('should delegate to datasource for product deletion', async () => {
      // Arrange
      const productId = 1;

      mockDataSource.deleteProduct.mockResolvedValue();

      // Act
      await productRepository.deleteProduct(productId);

      // Assert
      expect(mockDataSource.deleteProduct).toHaveBeenCalledTimes(1);
      expect(mockDataSource.deleteProduct).toHaveBeenCalledWith(productId);
    });

    test('should propagate error from datasource when product not found', async () => {
      // Arrange
      const productId = 999;
      const expectedError = new Error('Product not found');

      mockDataSource.deleteProduct.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(productRepository.deleteProduct(productId)).rejects.toThrow(expectedError);
      expect(mockDataSource.deleteProduct).toHaveBeenCalledWith(productId);
    });
  });

  describe('constructor', () => {
    test('should initialize with provided datasource', () => {
      // Act
      const repository = new ProductRepositoryImpl(mockDataSource);

      // Assert
      expect(repository).toBeInstanceOf(ProductRepositoryImpl);
      expect(repository['productDataSource']).toBe(mockDataSource);
    });
  });
});
