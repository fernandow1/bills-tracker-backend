import { Role } from '@domain/enums/role.enum';

export class User {
  id: number;
  name: string;
  surname: string | null;
  email: string;
  username: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(
    id: number,
    name: string,
    username: string,
    surname: string | null,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    role: Role = Role.Guest,
    deletedAt?: Date | null,
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.username = username;
    this.surname = surname;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt || null;
  }
}
