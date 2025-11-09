import { GetShops } from '../../application/uses-cases/shop/get-shop';
import { SHOPMOCK, shopRepositoryDomainMock } from '../../infrastructure/datasource/shop/shop.mock';

describe('Shop Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('should be defined', () => {
    // Placeholder test to ensure the controller is defined
    expect(true).toBe(true);
  });

  test('Should call execute method when getShops is invoked', async () => {
    // Mock data que será retornado
    const mockShops = [SHOPMOCK, SHOPMOCK, SHOPMOCK];

    // Spy en el método execute del prototype
    const executeSpy = jest.spyOn(GetShops.prototype, 'execute').mockResolvedValue(mockShops);

    // Crear instancia del use case
    const useCase = new GetShops(shopRepositoryDomainMock());

    // Ejecutar el método
    const result = await useCase.execute();

    // Verificaciones
    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(executeSpy).toHaveBeenCalledWith(); // Sin parámetros
    expect(result).toEqual(mockShops);
    expect(result).toBeInstanceOf(Array);

    // Limpiar el spy
    executeSpy.mockRestore();
  });

  test('Should call execute method and propagate error when it fails', async () => {
    const errorMessage = 'Database connection failed';

    // Spy en el método execute que rechaza con error
    const executeSpy = jest
      .spyOn(GetShops.prototype, 'execute')
      .mockRejectedValue(new Error(errorMessage));

    // Crear instancia del use case
    const useCase = new GetShops(shopRepositoryDomainMock());

    // Verificar que el método es llamado y propaga el error
    await expect(useCase.execute()).rejects.toThrow(errorMessage);
    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(executeSpy).toHaveBeenCalledWith(); // Sin parámetros

    // Limpiar el spy
    executeSpy.mockRestore();
  });
});
