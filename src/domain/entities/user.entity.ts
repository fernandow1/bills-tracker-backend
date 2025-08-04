export class User {
  id: number;
  name: string;
  surname: string | undefined;
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(
    id: number,
    name: string,
    username: string,
    surname: string | undefined,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date | null,
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.username = username;
    this.surname = surname;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt || null;
  }

  get fullName(): string {
    return `${this.name} ${this.surname || ''}`.trim();
  }
}
