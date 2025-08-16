import { Shop } from '@domain/entities/shop.entity';
import { ShopRepository } from '@domain/repository/shop.repository';

export interface GetShopsUseCase {
  execute(): Promise<Shop[]>;
}

export class GetShops implements GetShopsUseCase {
  private shopRepository: ShopRepository;

  constructor(shopRepository: ShopRepository) {
    this.shopRepository = shopRepository;
  }

  execute(): Promise<Shop[]> {
    return this.shopRepository.getAllShops();
  }
}
