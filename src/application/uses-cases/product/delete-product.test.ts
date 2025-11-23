import { DeleteProduct } from './delete-product';
import { ProductRepository } from '../../../domain/repository/product.repository';
import { createMockedProductRepositoryInterface } from '../../../infrastructure/datasource/product/product.mock';

describe('DeleteProduct Use Case', () => {
  let deleteProduct: DeleteProduct;
  let mockProductRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    mockProductRepository = createMockedProductRepositoryInterface();
    deleteProduct = new DeleteProduct(mockProductRepository);

    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete a product successfully', async () => {
      // Arrange
      const productId = 1;
      mockProductRepository.deleteProduct.mockResolvedValue(undefined);

      // Act
      const result = await deleteProduct.execute(productId);

      // Assert
      expect(result).toBeUndefined();
      expect(mockProductRepository.deleteProduct).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.deleteProduct).toHaveBeenCalledWith(productId);
    });

    it('should delete products with different ids', async () => {
      // Arrange
      const productIds = [1, 2, 3, 42, 999];

      // Act & Assert
      for (const productId of productIds) {
        mockProductRepository.deleteProduct.mockResolvedValue(undefined);

        const result = await deleteProduct.execute(productId);

        expect(result).toBeUndefined();
        expect(mockProductRepository.deleteProduct).toHaveBeenCalledWith(productId);
      }
    });

    it('should handle large product id', async () => {
      // Arrange
      const productId = 999999;
      mockProductRepository.deleteProduct.mockResolvedValue(undefined);

      // Act
      const result = await deleteProduct.execute(productId);

      // Assert
      expect(result).toBeUndefined();
      expect(mockProductRepository.deleteProduct).toHaveBeenCalledWith(productId);
    });

    it('should propagate repository errors', async () => {
      // Arrange
      const productId = 1;
      const error = new Error('Database connection failed');
      mockProductRepository.deleteProduct.mockRejectedValue(error);

      // Act & Assert
      await expect(deleteProduct.execute(productId)).rejects.toThrow('Database connection failed');
      expect(mockProductRepository.deleteProduct).toHaveBeenCalledWith(productId);
    });

    it('should handle product not found errors', async () => {
      // Arrange
      const productId = 999;
      const notFoundError = new Error('Product not found');
      mockProductRepository.deleteProduct.mockRejectedValue(notFoundError);

      // Act & Assert
      await expect(deleteProduct.execute(productId)).rejects.toThrow('Product not found');
      expect(mockProductRepository.deleteProduct).toHaveBeenCalledWith(productId);
    });

    it('should handle foreign key constraint errors', async () => {
      // Arrange
      const productId = 1;
      const constraintError = new Error('Cannot delete product: foreign key constraint');
      mockProductRepository.deleteProduct.mockRejectedValue(constraintError);

      // Act & Assert
      await expect(deleteProduct.execute(productId)).rejects.toThrow(
        'Cannot delete product: foreign key constraint',
      );
      expect(mockProductRepository.deleteProduct).toHaveBeenCalledWith(productId);
    });

    it('should handle database timeout errors', async () => {
      // Arrange
      const productId = 1;
      const timeoutError = new Error('Delete operation timeout');
      mockProductRepository.deleteProduct.mockRejectedValue(timeoutError);

      // Act & Assert
      await expect(deleteProduct.execute(productId)).rejects.toThrow('Delete operation timeout');
      expect(mockProductRepository.deleteProduct).toHaveBeenCalledWith(productId);
    });

    it('should handle zero id', async () => {
      // Arrange
      const productId = 0;
      mockProductRepository.deleteProduct.mockResolvedValue(undefined);

      // Act
      const result = await deleteProduct.execute(productId);

      // Assert
      expect(result).toBeUndefined();
      expect(mockProductRepository.deleteProduct).toHaveBeenCalledWith(productId);
    });

    it('should handle negative id', async () => {
      // Arrange
      const productId = -1;
      const validationError = new Error('Invalid product ID');
      mockProductRepository.deleteProduct.mockRejectedValue(validationError);

      // Act & Assert
      await expect(deleteProduct.execute(productId)).rejects.toThrow('Invalid product ID');
      expect(mockProductRepository.deleteProduct).toHaveBeenCalledWith(productId);
    });

    it('should handle multiple delete operations in sequence', async () => {
      // Arrange
      const productIds = [1, 2, 3];
      mockProductRepository.deleteProduct.mockResolvedValue(undefined);

      // Act
      const deletePromises = productIds.map((id) => deleteProduct.execute(id));
      const results = await Promise.all(deletePromises);

      // Assert
      results.forEach((result) => {
        expect(result).toBeUndefined();
      });
      expect(mockProductRepository.deleteProduct).toHaveBeenCalledTimes(productIds.length);
    });

    it('should handle async operations properly', async () => {
      // Arrange
      const productId = 1;
      const delay = (ms: number): Promise<void> =>
        new Promise((resolve) => setTimeout(resolve, ms));

      mockProductRepository.deleteProduct.mockImplementation(async () => {
        await delay(10); // Simular operación asíncrona
        return undefined;
      });

      // Act
      const result = await deleteProduct.execute(productId);

      // Assert
      expect(result).toBeUndefined();
      expect(mockProductRepository.deleteProduct).toHaveBeenCalledWith(productId);
    });

    it('should handle repository throwing unexpected errors', async () => {
      // Arrange
      const productId = 1;
      const unexpectedError = new Error('Unexpected database error');
      mockProductRepository.deleteProduct.mockRejectedValue(unexpectedError);

      // Act & Assert
      await expect(deleteProduct.execute(productId)).rejects.toThrow('Unexpected database error');
      expect(mockProductRepository.deleteProduct).toHaveBeenCalledWith(productId);
    });

    it('should maintain consistent behavior across multiple calls', async () => {
      // Arrange
      const productId = 1;
      mockProductRepository.deleteProduct.mockResolvedValue(undefined);

      // Act
      const result1 = await deleteProduct.execute(productId);
      const result2 = await deleteProduct.execute(productId);
      const result3 = await deleteProduct.execute(productId);

      // Assert
      expect(result1).toBeUndefined();
      expect(result2).toBeUndefined();
      expect(result3).toBeUndefined();
      expect(mockProductRepository.deleteProduct).toHaveBeenCalledTimes(3);
    });

    it('should handle concurrent delete operations', async () => {
      // Arrange
      const productIds = [1, 2, 3, 4, 5];
      mockProductRepository.deleteProduct.mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 10)); // Simular latencia variable
        return undefined;
      });

      // Act
      const deletePromises = productIds.map((id) => deleteProduct.execute(id));
      const results = await Promise.all(deletePromises);

      // Assert
      results.forEach((result) => {
        expect(result).toBeUndefined();
      });
      expect(mockProductRepository.deleteProduct).toHaveBeenCalledTimes(productIds.length);
    });

    it('should not return any data on successful deletion', async () => {
      // Arrange
      const productId = 42;
      mockProductRepository.deleteProduct.mockResolvedValue(undefined);

      // Act
      const result = await deleteProduct.execute(productId);

      // Assert
      expect(result).toBeUndefined();
      expect(typeof result).toBe('undefined');
    });
  });

  describe('constructor', () => {
    it('should initialize with repository', () => {
      // Arrange & Act
      const useCase = new DeleteProduct(mockProductRepository);

      // Assert
      expect(useCase).toBeInstanceOf(DeleteProduct);
    });

    it('should store repository reference', () => {
      // Arrange & Act
      const useCase = new DeleteProduct(mockProductRepository);

      // Assert - Verificamos que el repositorio se usa correctamente
      expect(() => useCase.execute(1)).not.toThrow();
    });
  });
});
