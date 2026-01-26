import { Shop } from '@domain/entities/shop.entity';
import { ShopRepository } from '@domain/repository/shop.repository';

interface ShopWithDistance {
  shop: Shop;
  distance: number;
}

/**
 * Caso de uso para buscar shops cercanos a una ubicación dada
 * usando la fórmula de Haversine para calcular distancias en la esfera terrestre
 */
export class FindShopsByProximity {
  constructor(private readonly shopRepository: ShopRepository) {}

  /**
   * Busca shops dentro de un radio específico desde una ubicación
   * @param latitude - Latitud del punto de referencia
   * @param longitude - Longitud del punto de referencia
   * @param radiusKm - Radio de búsqueda en kilómetros
   * @returns Array de shops ordenados por distancia (más cercano primero)
   */
  async execute(latitude: number, longitude: number, radiusKm: number): Promise<Shop[]> {
    // Validar parámetros de entrada
    this.validateCoordinates(latitude, longitude);
    this.validateRadius(radiusKm);

    // Obtener todos los shops con ubicación
    const allShops = await this.shopRepository.findAll();

    // Filtrar shops que tienen ubicación y calcular distancias
    const shopsWithDistance: ShopWithDistance[] = allShops
      .filter((shop: Shop) => shop.hasLocation())
      .map((shop: Shop) => ({
        shop,
        distance: this.calculateDistance(
          latitude,
          longitude,
          shop.latitude!,
          shop.longitude!,
        ),
      }))
      .filter((item: ShopWithDistance) => item.distance <= radiusKm)
      .sort((a: ShopWithDistance, b: ShopWithDistance) => a.distance - b.distance);

    return shopsWithDistance.map((item: ShopWithDistance) => item.shop);
  }

  /**
   * Calcula la distancia entre dos puntos usando la fórmula de Haversine
   * @param lat1 - Latitud del punto 1
   * @param lon1 - Longitud del punto 1
   * @param lat2 - Latitud del punto 2
   * @param lon2 - Longitud del punto 2
   * @returns Distancia en kilómetros
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convierte grados a radianes
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Valida que las coordenadas estén en rangos válidos
   */
  private validateCoordinates(latitude: number, longitude: number): void {
    if (latitude < -90 || latitude > 90) {
      throw new Error(`Latitude must be between -90 and 90, received: ${latitude}`);
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error(`Longitude must be between -180 and 180, received: ${longitude}`);
    }
  }

  /**
   * Valida que el radio sea positivo
   */
  private validateRadius(radiusKm: number): void {
    if (radiusKm <= 0) {
      throw new Error(`Radius must be greater than 0, received: ${radiusKm}`);
    }
  }
}
