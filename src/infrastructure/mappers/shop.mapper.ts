import { Shop as DomainShop } from '@domain/entities/shop.entity';
import { Shop as InfraShop } from '@infrastructure/database/entities/shop.entity';

/**
 * Mapper para convertir entidades de Shop entre capas
 */
export class ShopMapper {
  /**
   * Convierte una entidad de infraestructura (TypeORM) a entidad de dominio
   */
  static toDomain(infraShop: InfraShop): DomainShop {
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
  static toDomainArray(infraShops: InfraShop[]): DomainShop[] {
    return infraShops.map((shop) => ShopMapper.toDomain(shop));
  }

  /**
   * Convierte una entidad de dominio a infraestructura (para persistencia)
   * Nota: Esto es raramente necesario ya que TypeORM acepta objetos planos
   */
  static toInfrastructure(domainShop: DomainShop): Partial<InfraShop> {
    return {
      id: domainShop.id,
      name: domainShop.name,
      description: domainShop.description,
      latitude: domainShop.latitude,
      longitude: domainShop.longitude,
    };
  }
}
