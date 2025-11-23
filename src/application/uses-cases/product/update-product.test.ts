import { UpdateProductDTO } from '../../dtos/product/update-product.dto';
import { UpdateProduct } from './update-product';
import { ProductRepository } from '../../../domain/repository/product.repository';
import { createMockedProductRepositoryInterface } from '../../../infrastructure/datasource/product/product.mock';

describe('UpdateProduct Use Case', () => {
  let updateProduct: UpdateProduct;
  let mockProductRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    mockProductRepository = createMockedProductRepositoryInterface();
    updateProduct = new UpdateProduct(mockProductRepository);

    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update a product successfully', async () => {
      // Arrange
      const productId = 1;
      const updateProductDto: UpdateProductDTO = {
        idBrand: 2,
        idCategory: 3,
        name: 'Producto Actualizado',
        description: 'Nueva descripción del producto',
      };

      const expectedResult: UpdateProductDTO = { ...updateProductDto };

      mockProductRepository.updateProduct.mockResolvedValue(expectedResult);

      // Act
      const result = await updateProduct.execute(productId, updateProductDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockProductRepository.updateProduct).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.updateProduct).toHaveBeenCalledWith(productId, updateProductDto);
    });

    it('should update product with partial data', async () => {
      // Arrange
      const productId = 1;
      const updateProductDto: UpdateProductDTO = {
        idBrand: 1,
        idCategory: 1,
        name: 'Solo Nombre Actualizado',
        description: null,
      };

      const expectedResult = { ...updateProductDto } as UpdateProductDTO;

      mockProductRepository.updateProduct.mockResolvedValue(expectedResult);

      // Act
      const result = await updateProduct.execute(productId, updateProductDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockProductRepository.updateProduct).toHaveBeenCalledWith(productId, updateProductDto);
    });

    it('should update product with only brand', async () => {
      // Arrange
      const productId = 5;
      const updateProductDto: UpdateProductDTO = {
        idBrand: 10,
        idCategory: 1,
        name: 'Producto actualizado',
        description: null,
      };

      const expectedResult = { ...updateProductDto } as UpdateProductDTO;

      mockProductRepository.updateProduct.mockResolvedValue(expectedResult);

      // Act
      const result = await updateProduct.execute(productId, updateProductDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockProductRepository.updateProduct).toHaveBeenCalledWith(productId, updateProductDto);
    });

    it('should update product with only category', async () => {
      // Arrange
      const productId = 3;
      const updateProductDto: UpdateProductDTO = {
        idBrand: 1,
        idCategory: 15,
        name: 'Producto actualizado',
        description: null,
      };

      const expectedResult = { ...updateProductDto } as UpdateProductDTO;

      mockProductRepository.updateProduct.mockResolvedValue(expectedResult);

      // Act
      const result = await updateProduct.execute(productId, updateProductDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockProductRepository.updateProduct).toHaveBeenCalledWith(productId, updateProductDto);
    });

    it('should update product with null description', async () => {
      // Arrange
      const productId = 2;
      const updateProductDto: UpdateProductDTO = {
        idBrand: 1,
        idCategory: 1,
        name: 'Producto Sin Descripción',
        description: null,
      };

      const expectedResult = { ...updateProductDto } as UpdateProductDTO;

      mockProductRepository.updateProduct.mockResolvedValue(expectedResult);

      // Act
      const result = await updateProduct.execute(productId, updateProductDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(result.description).toBeNull();
      expect(mockProductRepository.updateProduct).toHaveBeenCalledWith(productId, updateProductDto);
    });

    it('should handle different product id types', async () => {
      // Arrange
      const testCases = [
        {
          id: 1,
          dto: {
            idBrand: 1,
            idCategory: 1,
            name: 'Producto 1',
            description: null,
          } as UpdateProductDTO,
        },
        {
          id: 999,
          dto: {
            idBrand: 2,
            idCategory: 2,
            name: 'Producto 999',
            description: null,
          } as UpdateProductDTO,
        },
        {
          id: 42,
          dto: {
            idBrand: 3,
            idCategory: 3,
            name: 'Producto 42',
            description: null,
          } as UpdateProductDTO,
        },
      ];

      // Act & Assert
      for (const testCase of testCases) {
        const expectedResult = { ...testCase.dto } as UpdateProductDTO;
        mockProductRepository.updateProduct.mockResolvedValue(expectedResult);

        const result = await updateProduct.execute(testCase.id, testCase.dto);

        expect(result).toEqual(expectedResult);
        expect(mockProductRepository.updateProduct).toHaveBeenCalledWith(testCase.id, testCase.dto);
      }
    });

    it('should propagate repository errors', async () => {
      // Arrange
      const productId = 1;
      const updateProductDto: UpdateProductDTO = {
        idBrand: 1,
        idCategory: 1,
        name: 'Producto Error',
        description: null,
      };

      const error = new Error('Database connection failed');
      mockProductRepository.updateProduct.mockRejectedValue(error);

      // Act & Assert
      await expect(updateProduct.execute(productId, updateProductDto)).rejects.toThrow(
        'Database connection failed',
      );
      expect(mockProductRepository.updateProduct).toHaveBeenCalledWith(productId, updateProductDto);
    });

    it('should handle product not found errors', async () => {
      // Arrange
      const productId = 999;
      const updateProductDto: UpdateProductDTO = {
        idBrand: 1,
        idCategory: 1,
        name: 'Producto Inexistente',
        description: null,
      };

      const notFoundError = new Error('Product not found');
      mockProductRepository.updateProduct.mockRejectedValue(notFoundError);

      // Act & Assert
      await expect(updateProduct.execute(productId, updateProductDto)).rejects.toThrow(
        'Product not found',
      );
      expect(mockProductRepository.updateProduct).toHaveBeenCalledWith(productId, updateProductDto);
    });

    it('should handle validation errors from repository', async () => {
      // Arrange
      const productId = 1;
      const updateProductDto: UpdateProductDTO = {
        name: '', // Nombre vacío
        idBrand: -1, // ID inválido
        idCategory: 1,
        description: null,
      };

      const validationError = new Error('Invalid product data');
      mockProductRepository.updateProduct.mockRejectedValue(validationError);

      // Act & Assert
      await expect(updateProduct.execute(productId, updateProductDto)).rejects.toThrow(
        'Invalid product data',
      );
      expect(mockProductRepository.updateProduct).toHaveBeenCalledWith(productId, updateProductDto);
    });

    it('should handle repository returning null/undefined', async () => {
      // Arrange
      const productId = 1;
      const updateProductDto: UpdateProductDTO = {
        idBrand: 1,
        idCategory: 1,
        name: 'Producto Test',
        description: null,
      };

      mockProductRepository.updateProduct.mockResolvedValue(null as unknown as UpdateProductDTO);

      // Act
      const result = await updateProduct.execute(productId, updateProductDto);

      // Assert
      expect(result).toBeNull();
      expect(mockProductRepository.updateProduct).toHaveBeenCalledWith(productId, updateProductDto);
    });

    it('should pass through exact DTO structure', async () => {
      // Arrange
      const productId = 42;
      const updateProductDto: UpdateProductDTO = {
        idBrand: 999,
        idCategory: 888,
        name: 'Producto Completo Actualizado',
        description: 'Descripción completa actualizada con caracteres especiales: áéíóú ñ ¿?¡!',
      };

      const expectedResult: UpdateProductDTO = { ...updateProductDto };

      mockProductRepository.updateProduct.mockResolvedValue(expectedResult);

      // Act
      const result = await updateProduct.execute(productId, updateProductDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(result.name).toBe('Producto Completo Actualizado');
      expect(result.idBrand).toBe(999);
      expect(result.idCategory).toBe(888);
      expect(result.description).toBe(
        'Descripción completa actualizada con caracteres especiales: áéíóú ñ ¿?¡!',
      );
    });

    it('should handle async operations properly', async () => {
      // Arrange
      const productId = 1;
      const updateProductDto: UpdateProductDTO = {
        idBrand: 1,
        idCategory: 1,
        name: 'Producto Async',
        description: 'Actualización asíncrona',
      };

      const delay = (ms: number): Promise<void> =>
        new Promise((resolve) => setTimeout(resolve, ms));

      mockProductRepository.updateProduct.mockImplementation(async (id, dto) => {
        await delay(10); // Simular operación asíncrona
        return dto;
      });

      // Act
      const result = await updateProduct.execute(productId, updateProductDto);

      // Assert
      expect(result).toEqual(updateProductDto);
    });

    it('should handle zero and negative ids', async () => {
      // Arrange
      const testIds = [0, -1, -999];

      for (const productId of testIds) {
        const updateProductDto: UpdateProductDTO = {
          idBrand: 1,
          idCategory: 1,
          name: `Producto ID ${productId}`,
          description: null,
        };

        const validationError = new Error('Invalid product ID');
        mockProductRepository.updateProduct.mockRejectedValue(validationError);

        // Act & Assert
        await expect(updateProduct.execute(productId, updateProductDto)).rejects.toThrow(
          'Invalid product ID',
        );
        expect(mockProductRepository.updateProduct).toHaveBeenCalledWith(
          productId,
          updateProductDto,
        );
      }
    });
  });

  describe('constructor', () => {
    it('should initialize with repository', () => {
      // Arrange & Act
      const useCase = new UpdateProduct(mockProductRepository);

      // Assert
      expect(useCase).toBeInstanceOf(UpdateProduct);
    });

    it('should store repository reference', () => {
      // Arrange & Act
      const useCase = new UpdateProduct(mockProductRepository);

      // Assert - Verificamos que el repositorio se usa correctamente
      expect(() =>
        useCase.execute(1, { idBrand: 1, idCategory: 1, name: 'Test', description: null }),
      ).not.toThrow();
    });
  });
});
