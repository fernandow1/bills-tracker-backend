export class BrandCategory {
  id: number;
  idCategory: number;
  idBrand: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(
    id: number,
    idCategory: number,
    idBrand: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date | null,
  ) {
    this.id = id;
    this.idCategory = idCategory;
    this.idBrand = idBrand;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
