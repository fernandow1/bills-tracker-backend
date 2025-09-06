export class Product {
  id: number;
  idBrand: number;
  idCategory: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(
    id: number,
    idBrand: number,
    idCategory: number,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    description?: string | null,
    deletedAt?: Date | null,
  ) {
    this.id = id;
    this.idBrand = idBrand;
    this.idCategory = idCategory;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.description = description || null;
    this.deletedAt = deletedAt || null;
  }
}
