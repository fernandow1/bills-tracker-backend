export class Currency {
  id: number;
  code: string;
  name: string;
  symbol?: string | null;

  constructor(id: number, code: string, name: string, symbol?: string | null) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.symbol = symbol;
  }
}
