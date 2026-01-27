import { Shop as DomainShop } from '@domain/entities/shop.entity';
import { Shop as InfraShop } from '@infrastructure/database/entities/shop.entity';

/**
 * Convierte una entidad de infraestructura (TypeORM) a entidad de dominio
 */
export function shopToDomain(infraShop: InfraShop): DomainShop {
  return new DomainShop(
    infraShop.id,
    infraShop.name,
    infraShop.description,
    infraShop.latitude,
    infraShop.longitude,
  );
}

/**
 * Convierte un array de entidades de infraestructura a dominio
 */
export function shopsToDomain(infraShops: InfraShop[]): DomainShop[] {
  return infraShops.map((shop) => shopToDomain(shop));
}

/**
 * Convierte una entidad de dominio a infraestructura (para persistencia)
 * Nota: Esto es raramente necesario ya que TypeORM acepta objetos planos
 */
export function shopToInfrastructure(domainShop: DomainShop): Partial<InfraShop> {
  return {
    id: domainShop.id,
    name: domainShop.name,
    description: domainShop.description,
    latitude: domainShop.latitude,
    longitude: domainShop.longitude,
  };
}
