export class Bill {
  id: number;
  idShop: number;
  idCurrency: number;
  idPaymentMethod: number;
  idUser: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(
    id: number,
    idShop: number,
    idCurrency: number,
    idPaymentMethod: number,
    idUser: number,
    total: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date | null,
  ) {
    this.id = id;
    this.idShop = idShop;
    this.idCurrency = idCurrency;
    this.idPaymentMethod = idPaymentMethod;
    this.idUser = idUser;
    this.total = total;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
