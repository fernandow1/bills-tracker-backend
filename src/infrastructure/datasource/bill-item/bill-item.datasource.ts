import { ProductPriceByShop } from '@application/queries/product/product-price-by-shop.query-result';

export abstract class BillItemDataSource {
  abstract findCheapestShopsByProduct(
    productId: number,
    options?: { maxAgeDays?: number; limit?: number },
  ): Promise<ProductPriceByShop[]>;
}
