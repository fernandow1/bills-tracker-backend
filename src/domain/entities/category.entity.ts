export class Category {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string | null;
  deletedAt?: Date | null;

  constructor(
    id: number,
    idBrand: number,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    description?: string | null,
    deletedAt?: Date | null,
  ) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.description = description;
    this.deletedAt = deletedAt;
  }
}
