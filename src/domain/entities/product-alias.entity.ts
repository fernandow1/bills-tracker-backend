import { Shop } from '@domain/entities/shop.entity';
import { Product } from '@domain/entities/product.entity';

export class ProductAlias {
  id: number;
  idProduct: number;
  idShop: number;
  aliasName: string;

  shop?: Shop;
  product?: Product;

  constructor(
    id: number,
    idProduct: number,
    idShop: number,
    aliasName: string,
    shop?: Shop,
    product?: Product,
  ) {
    this.id = id;
    this.idProduct = idProduct;
    this.idShop = idShop;
    this.aliasName = aliasName;
    this.shop = shop;
    this.product = product;
  }
}
