import { NetUnits } from '@domain/value-objects/net-units.enum';

export class Product {
  id: number;
  idBrand: number;
  idCategory: number;
  name: string;
  description: string | null;
  price: number;
  netPrice: number;
  netUnit: NetUnits;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(
    id: number,
    idBrand: number,
    idCategory: number,
    name: string,
    price: number,
    netPrice: number,
    netUnit: NetUnits,
    createdAt: Date,
    updatedAt: Date,
    description?: string | null,
    deletedAt?: Date | null,
  ) {
    this.id = id;
    this.idBrand = idBrand;
    this.idCategory = idCategory;
    this.name = name;
    this.price = price;
    this.netPrice = netPrice;
    this.netUnit = netUnit;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.description = description || null;
    this.deletedAt = deletedAt || null;
  }
}
