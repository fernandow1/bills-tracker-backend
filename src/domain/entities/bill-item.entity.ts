import { NetUnits } from '@domain/value-objects/net-units.enum';

export class BillItem {
  id: number;
  idBill: number;
  idProduct: number;
  quantity: number;
  contentValue: number | null;
  netPrice: number;
  netUnit: NetUnits;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(
    id: number,
    idBill: number,
    idProduct: number,
    quantity: number,
    contentValue: number | null,
    netPrice: number,
    netUnit: NetUnits,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date | null,
  ) {
    this.id = id;
    this.idBill = idBill;
    this.idProduct = idProduct;
    this.quantity = quantity;
    this.contentValue = contentValue;
    this.netPrice = netPrice;
    this.netUnit = netUnit;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
