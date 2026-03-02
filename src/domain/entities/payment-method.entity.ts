export class PaymentMethod {
  id: number;
  uuid?: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(
    id: number,
    name: string,
    description: string | null,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    uuid?: string,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    if (uuid) this.uuid = uuid;
  }
}
