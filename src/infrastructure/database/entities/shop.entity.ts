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
import { Bill } from '@infrastructure/database/entities/bill.entity';

@Entity('shop')
export class Shop {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Index('idx_shop_name', { unique: true })
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
    charset: 'utf8mb4',
    collation: 'utf8mb4_bin',
  })
  name: string;

  @Column({ name: 'description', type: 'tinytext', nullable: false })
  description: string;

  @Column({
    name: 'latitude',
    type: 'double',
    precision: 9,
    scale: 6,
    nullable: true,
    default: null,
  })
  latitude: number;

  @Column({
    name: 'longitude',
    type: 'double',
    precision: 9,
    scale: 6,
    nullable: true,
    default: null,
  })
  longitude: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(0)',
    precision: 0,
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(0)',
    precision: 0,
    onUpdate: 'CURRENT_TIMESTAMP(0)',
    nullable: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    default: null,
    precision: 0,
    nullable: true,
  })
  deletedAt: Date;

  @OneToMany(() => Bill, (bill) => bill.shop)
  bills: Bill[];
}
