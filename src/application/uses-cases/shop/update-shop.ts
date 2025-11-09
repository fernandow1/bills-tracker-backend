import { Shop } from '@domain/entities/shop.entity';
import { ShopRepository } from '@domain/repository/shop.repository';

export interface UpdateShopUseCase {
  execute(id: number, shopData: Partial<Shop>): Promise<Shop>;
}

export class UpdateShop implements UpdateShopUseCase {
  private shopRepository: ShopRepository;

  constructor(shopRepository: ShopRepository) {
    this.shopRepository = shopRepository;
  }

  execute(id: number, shopData: Partial<Shop>): Promise<Shop> {
    return this.shopRepository.updateShop(id, shopData);
  }
}
