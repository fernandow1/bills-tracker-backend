import { ProductPriceByShop } from '@application/queries/product/product-price-by-shop.query-result';
import { BillItemRepository } from '@domain/repository/bill-item.repository';

interface FindCheapestShopsOptions {
  maxAgeDays?: number;
  limit?: number;
}

/**
 * Use case para encontrar los shops donde un producto está más barato.
 * Retorna lista ordenada por precio (más barato primero).
 */
export class FindCheapestShops {
  constructor(private readonly billItemRepository: BillItemRepository) {}

  async execute(
    productId: number,
    options: FindCheapestShopsOptions = {},
  ): Promise<ProductPriceByShop[]> {
    // Validar productId
    if (!productId || productId <= 0) {
      throw new Error('Invalid productId');
    }

    // Validar options
    if (options.maxAgeDays !== undefined && options.maxAgeDays <= 0) {
      throw new Error('maxAgeDays must be greater than 0');
    }

    if (options.limit !== undefined && (options.limit <= 0 || options.limit > 50)) {
      throw new Error('limit must be between 1 and 50');
    }

    // Llamar al repositorio
    const results = await this.billItemRepository.findCheapestShopsByProduct(
      productId,
      options,
    );

    return results;
  }
}
