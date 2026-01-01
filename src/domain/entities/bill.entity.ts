export class Bill {
  id: number;
  idShop: number;
  idCurrency: number;
  idPaymentMethod: number;
  idUser: number;
  subTotal: number;
  discount: number;
  total: number;
  idUserOwner: number;
  purchasedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(
    id: number,
    idShop: number,
    idCurrency: number,
    idPaymentMethod: number,
    idUser: number,
    subTotal: number,
    discount: number,
    total: number,
    idUserOwner: number,
    purchasedAt: Date,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date | null,
  ) {
    this.id = id;
    this.idShop = idShop;
    this.idCurrency = idCurrency;
    this.idPaymentMethod = idPaymentMethod;
    this.idUser = idUser;
    this.subTotal = subTotal;
    this.discount = discount;
    this.total = total;
    this.idUserOwner = idUserOwner;
    this.purchasedAt = purchasedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
