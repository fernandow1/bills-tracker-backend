export class Shop {
  id: number;
  name: string;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(
    id: number,
    name: string,
    description?: string | null,
    latitude?: number | null,
    longitude?: number | null,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
