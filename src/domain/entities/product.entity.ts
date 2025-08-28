import { NetUnits } from '@domain/value-objects/net-units.enum';

export class Product {
  id: number;
  idBrand: number;
  idCategory: number;
  name: string;
  description: string | null;
  netPrice: number;
  netUnit: NetUnits;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(
    id: number,
    idBrand: number,
    idCategory: number,
    name: string,
    netPrice: number,
    netUnit: NetUnits,
    quantity: number,
    createdAt: Date,
    updatedAt: Date,
    description?: string | null,
    deletedAt?: Date | null,
  ) {
    this.id = id;
    this.idBrand = idBrand;
    this.idCategory = idCategory;
    this.name = name;
    this.netPrice = netPrice;
    this.netUnit = netUnit;
    this.quantity = quantity;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.description = description || null;
    this.deletedAt = deletedAt || null;
  }
}
