export class Shop {
  id: number;
  name: string;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(
    id: number,
    name: string,
    description?: string | null,
    latitude?: number | null,
    longitude?: number | null,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.latitude = this.validateLatitude(latitude);
    this.longitude = this.validateLongitude(longitude);
  }

  /**
   * Verifica si el shop tiene coordenadas de ubicación definidas
   * @returns true si tanto latitude como longitude están definidas
   */
  hasLocation(): boolean {
    return this.latitude !== null && this.latitude !== undefined && 
           this.longitude !== null && this.longitude !== undefined;
  }

  /**
   * Valida que la latitud esté en el rango válido [-90, 90]
   * @param latitude - Latitud a validar
   * @returns La latitud validada o null/undefined si no se provee
   * @throws Error si la latitud está fuera del rango válido
   */
  private validateLatitude(latitude?: number | null): number | null | undefined {
    if (latitude === null || latitude === undefined) {
      return latitude;
    }
    if (latitude < -90 || latitude > 90) {
      throw new Error(`Latitude must be between -90 and 90, received: ${latitude}`);
    }
    return latitude;
  }

  /**
   * Valida que la longitud esté en el rango válido [-180, 180]
   * @param longitude - Longitud a validar
   * @returns La longitud validada o null/undefined si no se provee
   * @throws Error si la longitud está fuera del rango válido
   */
  private validateLongitude(longitude?: number | null): number | null | undefined {
    if (longitude === null || longitude === undefined) {
      return longitude;
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error(`Longitude must be between -180 and 180, received: ${longitude}`);
    }
    return longitude;
  }
}
