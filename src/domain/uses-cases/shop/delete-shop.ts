import { ShopRepository } from '@domain/repository/shop.repository';

export interface DeleteShopUseCase {
  execute(id: number): Promise<void>;
}

export class DeleteShop implements DeleteShopUseCase {
  private shopRepository: ShopRepository;

  constructor(shopRepository: ShopRepository) {
    this.shopRepository = shopRepository;
  }

  async execute(id: number): Promise<void> {
    await this.shopRepository.deleteShop(id);
  }
}
