import { Shop } from '@domain/entities/shop.entity';
import { ShopRepository } from '@domain/repository/shop.repository';

export interface CreateShopUseCase {
  execute(shopData: Partial<Shop>): Promise<Shop>;
}

export class CreateShop {
  constructor(private shopRepository: ShopRepository) {}

  execute(shopData: Partial<Shop>): Promise<Partial<Shop>> {
    return this.shopRepository.createShop(shopData);
  }
}
