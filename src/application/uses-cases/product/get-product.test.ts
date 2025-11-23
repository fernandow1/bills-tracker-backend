import { GetProduct } from './get-product';
import { Product } from '../../../domain/entities/product.entity';
import { ProductRepository } from '../../../domain/repository/product.repository';
import { createMockedProductRepositoryInterface } from '../../../infrastructure/datasource/product/product.mock';

describe('GetProduct Use Case', () => {
  let getProduct: GetProduct;
  let mockProductRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    mockProductRepository = createMockedProductRepositoryInterface();
    getProduct = new GetProduct(mockProductRepository);

    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should get a product by id successfully', async () => {
      // Arrange
      const productId = 1;
      const expectedProduct: Product = {
        id: productId,
        idBrand: 1,
        idCategory: 1,
        name: 'Producto Test',
        description: 'Descripción del producto test',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        deletedAt: null,
      };

      mockProductRepository.getProductById.mockResolvedValue(expectedProduct);

      // Act
      const result = await getProduct.execute(productId);

      // Assert
      expect(result).toEqual(expectedProduct);
      expect(mockProductRepository.getProductById).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.getProductById).toHaveBeenCalledWith(productId);
    });

    it('should get product with different brand and category', async () => {
      // Arrange
      const productId = 2;
      const expectedProduct: Product = {
        id: productId,
        idBrand: 5,
        idCategory: 10,
        name: 'Producto Específico',
        description: 'Descripción específica',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        deletedAt: null,
      };

      mockProductRepository.getProductById.mockResolvedValue(expectedProduct);

      // Act
      const result = await getProduct.execute(productId);

      // Assert
      expect(result).toEqual(expectedProduct);
      expect(result.idBrand).toBe(5);
      expect(result.idCategory).toBe(10);
      expect(mockProductRepository.getProductById).toHaveBeenCalledWith(productId);
    });

    it('should handle different product id types', async () => {
      // Arrange
      const productIds = [1, 999, 12345];
      const mockProducts = productIds.map((id) => ({
        id,
        idBrand: 1,
        idCategory: 1,
        name: `Producto ${id}`,
        description: `Descripción del producto ${id}`,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        deletedAt: null,
      }));

      // Act & Assert
      for (let i = 0; i < productIds.length; i++) {
        mockProductRepository.getProductById.mockResolvedValue(mockProducts[i]);

        const result = await getProduct.execute(productIds[i]);

        expect(result).toEqual(mockProducts[i]);
        expect(mockProductRepository.getProductById).toHaveBeenCalledWith(productIds[i]);
      }
    });

    it('should propagate repository errors', async () => {
      // Arrange
      const productId = 1;
      const error = new Error('Database connection failed');

      mockProductRepository.getProductById.mockRejectedValue(error);

      // Act & Assert
      await expect(getProduct.execute(productId)).rejects.toThrow('Database connection failed');
      expect(mockProductRepository.getProductById).toHaveBeenCalledWith(productId);
    });

    it('should handle product not found scenarios', async () => {
      // Arrange
      const productId = 999;
      const notFoundError = new Error('Product not found');

      mockProductRepository.getProductById.mockRejectedValue(notFoundError);

      // Act & Assert
      await expect(getProduct.execute(productId)).rejects.toThrow('Product not found');
      expect(mockProductRepository.getProductById).toHaveBeenCalledWith(productId);
    });

    it('should handle repository returning null', async () => {
      // Arrange
      const productId = 1;

      mockProductRepository.getProductById.mockResolvedValue(null as unknown as Product);

      // Act
      const result = await getProduct.execute(productId);

      // Assert
      expect(result).toBeNull();
      expect(mockProductRepository.getProductById).toHaveBeenCalledWith(productId);
    });

    it('should handle zero id', async () => {
      // Arrange
      const productId = 0;
      const expectedProduct: Product = {
        id: productId,
        idBrand: 1,
        idCategory: 1,
        name: 'Producto Zero',
        description: 'Producto con ID cero',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        deletedAt: null,
      };

      mockProductRepository.getProductById.mockResolvedValue(expectedProduct);

      // Act
      const result = await getProduct.execute(productId);

      // Assert
      expect(result).toEqual(expectedProduct);
      expect(mockProductRepository.getProductById).toHaveBeenCalledWith(productId);
    });

    it('should handle negative id', async () => {
      // Arrange
      const productId = -1;
      const validationError = new Error('Invalid product ID');

      mockProductRepository.getProductById.mockRejectedValue(validationError);

      // Act & Assert
      await expect(getProduct.execute(productId)).rejects.toThrow('Invalid product ID');
      expect(mockProductRepository.getProductById).toHaveBeenCalledWith(productId);
    });

    it('should preserve product entity structure', async () => {
      // Arrange
      const productId = 1;
      const baseDate = new Date('2024-01-01');
      const expectedProduct: Product = {
        id: productId,
        idBrand: 5,
        idCategory: 10,
        name: 'Producto Estructurado',
        description: 'Descripción estructurada',
        createdAt: baseDate,
        updatedAt: baseDate,
        deletedAt: null,
      };

      mockProductRepository.getProductById.mockResolvedValue(expectedProduct);

      // Act
      const result = await getProduct.execute(productId);

      // Assert
      expect(result).toEqual(expectedProduct);
      expect(result.id).toBe(productId);
      expect(result.name).toBe('Producto Estructurado');
      expect(result.idBrand).toBe(5);
      expect(result.idCategory).toBe(10);
      expect(result.createdAt).toEqual(baseDate);
    });

    it('should handle products with null description', async () => {
      // Arrange
      const productId = 1;
      const expectedProduct: Product = {
        id: productId,
        idBrand: 1,
        idCategory: 1,
        name: 'Producto Sin Descripción',
        description: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        deletedAt: null,
      };

      mockProductRepository.getProductById.mockResolvedValue(expectedProduct);

      // Act
      const result = await getProduct.execute(productId);

      // Assert
      expect(result).toEqual(expectedProduct);
      expect(result.description).toBeNull();
    });

    it('should handle async operations properly', async () => {
      // Arrange
      const productId = 1;
      const expectedProduct: Product = {
        id: productId,
        idBrand: 1,
        idCategory: 1,
        name: 'Producto Async',
        description: 'Producto asíncrono',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        deletedAt: null,
      };

      const delay = (ms: number): Promise<void> =>
        new Promise((resolve) => setTimeout(resolve, ms));

      mockProductRepository.getProductById.mockImplementation(async () => {
        await delay(10); // Simular operación asíncrona
        return expectedProduct;
      });

      // Act
      const result = await getProduct.execute(productId);

      // Assert
      expect(result).toEqual(expectedProduct);
    });
  });

  describe('constructor', () => {
    it('should initialize with repository', () => {
      // Arrange & Act
      const useCase = new GetProduct(mockProductRepository);

      // Assert
      expect(useCase).toBeInstanceOf(GetProduct);
    });

    it('should store repository reference', () => {
      // Arrange & Act
      const useCase = new GetProduct(mockProductRepository);

      // Assert - Verificamos que el repositorio se usa correctamente
      expect(() => useCase.execute(1)).not.toThrow();
    });
  });
});
