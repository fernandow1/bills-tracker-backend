import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('shop')
export class Shop {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Index('idx_shop_name')
  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
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
}
