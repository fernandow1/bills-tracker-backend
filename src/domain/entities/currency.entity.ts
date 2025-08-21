export class Currency {
  id: number;
  code: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  symbol?: string | null;

  constructor(
    id: number,
    code: string,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date | null,
    symbol?: string | null,
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.symbol = symbol;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
