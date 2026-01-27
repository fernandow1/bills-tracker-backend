export type ProductPriceByShop = {
  shopId: number;
  shopName: string;
  latitude: number | null;
  longitude: number | null;
  lastPrice: number;
  lastPurchaseDate: Date;
  currency: string;
};
