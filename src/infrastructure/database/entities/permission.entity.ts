import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '@infrastructure/database/entities/role.entity';

@Index('idx_permission_action_subject', ['action', 'subject'], { unique: true })
@Entity('permission')
export class Permission {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'action', type: 'varchar', length: 50, nullable: false })
  action: string;

  @Column({ name: 'subject', type: 'varchar', length: 50, nullable: false })
  subject: string;

  @Column({ name: 'description', type: 'tinytext', nullable: true })
  description: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(0)',
    nullable: false,
    precision: 0,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(0)',
    onUpdate: 'CURRENT_TIMESTAMP(0)',
    nullable: false,
    precision: 0,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    default: () => null,
    select: false,
    nullable: true,
    precision: 0,
  })
  deletedAt: Date | null;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
