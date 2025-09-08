import { NetUnits } from '@domain/value-objects/net-units.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('bill_item')
export class BillItem {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'id_bill', type: 'int', unsigned: true })
  idBill: number;

  @Column({ name: 'id_product', type: 'int', unsigned: true })
  idProduct: number;

  @Column({ name: 'quantity', type: 'int', unsigned: true })
  quantity: number;

  @Column({ name: 'net_price', type: 'decimal', precision: 10, scale: 2, unsigned: true })
  netPrice: number;

  @Column({ name: 'net_unit', type: 'enum', enum: NetUnits, nullable: false })
  netUnit: NetUnits;

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
    default: null,
    nullable: true,
    precision: 0,
  })
  deletedAt?: Date | null;
}
