import { FindShopsByProximity } from './find-shops-by-proximity';
import { ShopRepository } from '../../../domain/repository/shop.repository';
import { Shop } from '../../../domain/entities/shop.entity';

describe('FindShopsByProximity', () => {
  let useCase: FindShopsByProximity;
  let mockShopRepository: jest.Mocked<ShopRepository>;

  beforeEach(() => {
    mockShopRepository = {
      findAll: jest.fn(),
    } as any;

    useCase = new FindShopsByProximity(mockShopRepository);
  });

  describe('execute', () => {
    it('should return shops within the specified radius', async () => {
      // Arrange: Buenos Aires city center
      const centerLat = -34.6037;
      const centerLon = -58.3816;
      const radiusKm = 5;

      const shops = [
        new Shop(1, 'Shop Obelisco', null, -34.6037, -58.3816), // 0 km
        new Shop(2, 'Shop Palermo', null, -34.5875, -58.4173), // ~4 km
        new Shop(3, 'Shop La Plata', null, -34.9214, -57.9544), // ~50 km (fuera de rango)
        new Shop(4, 'Shop Sin Ubicación', null, null, null), // Sin coordenadas
      ];

      mockShopRepository.findAll.mockResolvedValue(shops);

      // Act
      const result = await useCase.execute(centerLat, centerLon, radiusKm);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Shop Obelisco');
      expect(result[1].name).toBe('Shop Palermo');
    });

    it('should return empty array when no shops are within radius', async () => {
      const shops = [new Shop(1, 'Shop Lejano', null, -34.9214, -57.9544)];
      mockShopRepository.findAll.mockResolvedValue(shops);

      const result = await useCase.execute(-34.6037, -58.3816, 1);

      expect(result).toHaveLength(0);
    });

    it('should filter out shops without location', async () => {
      const shops = [
        new Shop(1, 'Shop Sin Ubicación 1', null, null, null),
        new Shop(2, 'Shop Sin Ubicación 2', null, undefined, undefined),
      ];
      mockShopRepository.findAll.mockResolvedValue(shops);

      const result = await useCase.execute(-34.6037, -58.3816, 10);

      expect(result).toHaveLength(0);
    });

    it('should throw error for invalid latitude', async () => {
      await expect(useCase.execute(91, -58.3816, 10)).rejects.toThrow(
        'Latitude must be between -90 and 90',
      );

      await expect(useCase.execute(-91, -58.3816, 10)).rejects.toThrow(
        'Latitude must be between -90 and 90',
      );
    });

    it('should throw error for invalid longitude', async () => {
      await expect(useCase.execute(-34.6037, 181, 10)).rejects.toThrow(
        'Longitude must be between -180 and 180',
      );

      await expect(useCase.execute(-34.6037, -181, 10)).rejects.toThrow(
        'Longitude must be between -180 and 180',
      );
    });

    it('should throw error for invalid radius', async () => {
      await expect(useCase.execute(-34.6037, -58.3816, 0)).rejects.toThrow(
        'Radius must be greater than 0',
      );

      await expect(useCase.execute(-34.6037, -58.3816, -5)).rejects.toThrow(
        'Radius must be greater than 0',
      );
    });

    it('should sort results by distance (closest first)', async () => {
      const centerLat = -34.6037;
      const centerLon = -58.3816;

      const shops = [
        new Shop(1, 'Shop Lejano', null, -34.5875, -58.4173), // ~4 km
        new Shop(2, 'Shop Cercano', null, -34.6037, -58.3816), // 0 km
        new Shop(3, 'Shop Medio', null, -34.6100, -58.3900), // ~1 km
      ];

      mockShopRepository.findAll.mockResolvedValue(shops);

      const result = await useCase.execute(centerLat, centerLon, 10);

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('Shop Cercano');
      expect(result[1].name).toBe('Shop Medio');
      expect(result[2].name).toBe('Shop Lejano');
    });
  });
});
