import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column({ name: 'username', type: 'varchar', length: 100, nullable: false })
  username: string;

  @Column({ name: 'password', type: 'varchar', length: 255, nullable: false, select: false })
  password: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
    precision: 0,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
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
}
