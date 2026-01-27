import { ProductPriceByShop } from '@application/queries/product/product-price-by-shop.query-result';

/**
 * Tipo para el resultado de la query SQL raw
 */
interface ProductPriceQueryRow {
  shop_id: number;
  shop_name: string;
  latitude: number | null;
  longitude: number | null;
  last_price: string | number;
  last_purchase_date: string | Date;
  currency: string;
}

/**
 * Convierte resultado de query SQL a ProductPriceByShop.
 */
export function mapProductPriceByShop(row: ProductPriceQueryRow): ProductPriceByShop {
  return {
    shopId: row.shop_id,
    shopName: row.shop_name,
    latitude: row.latitude,
    longitude: row.longitude,
    lastPrice: parseFloat(row.last_price.toString()),
    lastPurchaseDate: new Date(row.last_purchase_date),
    currency: row.currency,
  };
}
