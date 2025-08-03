import { Shop } from '@/domain/entities/shop.entity';
import { ShopRepository } from '@/domain/repository/shop.repository';

export interface CreateShopUseCase {
  execute(shopData: Shop): Promise<Shop>;
}

export class CreateShop {
  constructor(private shopRepository: ShopRepository) {}

  execute(shopData: Shop): Promise<Shop> {
    return this.shopRepository.createShop(shopData);
  }
}
