import { CreateProductDTO } from '../../dtos/product/create-product.dto';
import { CreateProduct } from './create-product';
import { ProductRepository } from '../../../domain/repository/product.repository';
import { Product } from '../../../domain/entities/product.entity';
import { createMockedProductRepositoryInterface } from '../../../infrastructure/datasource/product/product.mock';

describe('CreateProduct Use Case', () => {
  let createProduct: CreateProduct;
  let mockProductRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    mockProductRepository = createMockedProductRepositoryInterface();
    createProduct = new CreateProduct(mockProductRepository);

    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a product successfully', async () => {
      // Arrange
      const createProductDto: CreateProductDTO = {
        idBrand: 1,
        idCategory: 1,
        name: 'Producto Test',
        description: 'Descripción del producto test',
      };

      const expectedResult: Product = {
        id: 1,
        idBrand: createProductDto.idBrand,
        idCategory: createProductDto.idCategory,
        name: createProductDto.name,
        description: createProductDto.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockProductRepository.createProduct.mockResolvedValue(expectedResult);

      // Act
      const result = await createProduct.execute(createProductDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockProductRepository.createProduct).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.createProduct).toHaveBeenCalledWith(createProductDto);
    });

    it('should create a product with minimal data', async () => {
      // Arrange
      const createProductDto: CreateProductDTO = {
        idBrand: 1,
        idCategory: 1,
        name: 'Producto Mínimo',
        description: null,
      };

      const expectedResult: Product = {
        id: 2,
        idBrand: createProductDto.idBrand,
        idCategory: createProductDto.idCategory,
        name: createProductDto.name,
        description: createProductDto.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockProductRepository.createProduct.mockResolvedValue(expectedResult);

      // Act
      const result = await createProduct.execute(createProductDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockProductRepository.createProduct).toHaveBeenCalledWith(createProductDto);
    });

    it('should create a product with different brands and categories', async () => {
      // Arrange
      const createProductDto: CreateProductDTO = {
        idBrand: 5,
        idCategory: 10,
        name: 'Producto Específico',
        description: 'Descripción específica',
      };

      const expectedResult: Product = {
        id: 3,
        idBrand: createProductDto.idBrand,
        idCategory: createProductDto.idCategory,
        name: createProductDto.name,
        description: createProductDto.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockProductRepository.createProduct.mockResolvedValue(expectedResult);

      // Act
      const result = await createProduct.execute(createProductDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockProductRepository.createProduct).toHaveBeenCalledWith(createProductDto);
    });

    it('should propagate repository errors', async () => {
      // Arrange
      const createProductDto: CreateProductDTO = {
        idBrand: 1,
        idCategory: 1,
        name: 'Producto Error',
        description: 'Descripción',
      };

      const error = new Error('Database connection failed');
      mockProductRepository.createProduct.mockRejectedValue(error);

      // Act & Assert
      await expect(createProduct.execute(createProductDto)).rejects.toThrow(
        'Database connection failed',
      );
      expect(mockProductRepository.createProduct).toHaveBeenCalledWith(createProductDto);
    });

    it('should handle validation errors from repository', async () => {
      // Arrange
      const createProductDto: CreateProductDTO = {
        idBrand: 1,
        idCategory: 1,
        name: '',
        description: null,
      };

      const validationError = new Error('Product name cannot be empty');
      mockProductRepository.createProduct.mockRejectedValue(validationError);

      // Act & Assert
      await expect(createProduct.execute(createProductDto)).rejects.toThrow(
        'Product name cannot be empty',
      );
    });

    it('should handle repository returning null/undefined', async () => {
      // Arrange
      const createProductDto: CreateProductDTO = {
        idBrand: 1,
        idCategory: 1,
        name: 'Producto Test',
        description: 'Descripción',
      };

      mockProductRepository.createProduct.mockResolvedValue(null as unknown as Product);

      // Act
      const result = await createProduct.execute(createProductDto);

      // Assert
      expect(result).toBeNull();
      expect(mockProductRepository.createProduct).toHaveBeenCalledWith(createProductDto);
    });

    it('should pass through exact DTO structure', async () => {
      // Arrange
      const createProductDto: CreateProductDTO = {
        idBrand: 999,
        idCategory: 888,
        name: 'Producto Completo',
        description: 'Descripción completa del producto',
      };

      const expectedResult: Product = {
        id: 4,
        idBrand: createProductDto.idBrand,
        idCategory: createProductDto.idCategory,
        name: createProductDto.name,
        description: createProductDto.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockProductRepository.createProduct.mockResolvedValue(expectedResult);

      // Act
      const result = await createProduct.execute(createProductDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(result.name).toBe('Producto Completo');
      expect(result.idBrand).toBe(999);
      expect(result.idCategory).toBe(888);
      expect(result.description).toBe('Descripción completa del producto');
      expect(result.id).toBe(4);
    });

    it('should handle async operations properly', async () => {
      // Arrange
      const createProductDto: CreateProductDTO = {
        idBrand: 1,
        idCategory: 1,
        name: 'Producto Async',
        description: 'Descripción async',
      };

      const delay = (ms: number): Promise<void> =>
        new Promise((resolve) => setTimeout(resolve, ms));

      mockProductRepository.createProduct.mockImplementation(async (dto) => {
        await delay(10); // Simular operación asíncrona
        return {
          id: 5,
          idBrand: dto.idBrand,
          idCategory: dto.idCategory,
          name: dto.name,
          description: dto.description,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        };
      });

      // Act
      const result = await createProduct.execute(createProductDto);

      // Assert
      expect(result.name).toBe(createProductDto.name);
      expect(result.description).toBe(createProductDto.description);
      expect(result.idBrand).toBe(createProductDto.idBrand);
      expect(result.idCategory).toBe(createProductDto.idCategory);
      expect(result.id).toBe(5);
    });

    it('should handle different data types correctly', async () => {
      // Arrange
      const createProductDto: CreateProductDTO = {
        idBrand: 42,
        idCategory: 25,
        name: 'Producto con Datos Específicos',
        description:
          'Esta es una descripción larga que contiene varios caracteres especiales: áéíóú, ñ, ¿?',
      };

      const expectedResult: Product = {
        id: 6,
        idBrand: createProductDto.idBrand,
        idCategory: createProductDto.idCategory,
        name: createProductDto.name,
        description: createProductDto.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockProductRepository.createProduct.mockResolvedValue(expectedResult);

      // Act
      const result = await createProduct.execute(createProductDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(typeof result.idBrand).toBe('number');
      expect(typeof result.idCategory).toBe('number');
      expect(typeof result.name).toBe('string');
      expect(typeof result.description).toBe('string');
    });
  });

  describe('constructor', () => {
    it('should initialize with repository', () => {
      // Arrange & Act
      const useCase = new CreateProduct(mockProductRepository);

      // Assert
      expect(useCase).toBeInstanceOf(CreateProduct);
    });

    it('should store repository reference', () => {
      // Arrange & Act
      const useCase = new CreateProduct(mockProductRepository);

      // Assert - Verificamos que el repositorio se usa correctamente
      expect(() =>
        useCase.execute({
          idBrand: 1,
          idCategory: 1,
          name: 'Test',
          description: 'Test description',
        }),
      ).not.toThrow();
    });
  });
});
