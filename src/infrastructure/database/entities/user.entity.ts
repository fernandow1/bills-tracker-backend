import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Bill } from './bill.entity';
import { Role } from '@domain/enums/role.enum';

@Index('idx_user_email', ['email'], { unique: true })
@Index('idx_user_username', ['username'], { unique: true })
@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ name: 'surname', type: 'varchar', length: 100, nullable: true, default: null })
  surname: string | null;

  @Column({ name: 'email', type: 'varchar', length: 100, nullable: false })
  email: string;

  @Column({
    name: 'username',
    type: 'varchar',
    length: 100,
    nullable: false,
    collation: 'utf8mb4_bin',
  })
  username: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    nullable: false,
    select: false,
    collation: 'utf8mb4_bin',
  })
  password: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: Role,
    default: Role.Guest,
    nullable: false,
  })
  role: Role;

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

  @OneToMany(() => Bill, (bill) => bill.userOwner)
  ownedBills: Bill[];

  @OneToMany(() => Bill, (bill) => bill.userCreator)
  createdBills: Bill[];
}
