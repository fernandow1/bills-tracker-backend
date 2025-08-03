export class Shop {
  id: number;
  name: string;
  description?: string | null;
  location?: string | null;

  constructor(id: number, name: string, description?: string | null, location?: string | null) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.location = location;
  }
}
