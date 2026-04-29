import { Permission } from '@domain/entities/permission.entity';

export class Role {
  id: number;
  name: string;
  description: string | null;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(
    id: number,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    description: string | null = null,
    permissions: Permission[] = [],
    deletedAt: Date | null = null,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.permissions = permissions;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
