export class Permission {
  id: number;
  action: string;
  subject: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(
    id: number,
    action: string,
    subject: string,
    createdAt: Date,
    updatedAt: Date,
    description: string | null = null,
    deletedAt: Date | null = null,
  ) {
    this.id = id;
    this.action = action;
    this.subject = subject;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
