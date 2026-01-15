import { NetUnits } from '@domain/value-objects/net-units.enum';
import {
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Bill } from './bill.entity';

@Index('uq_bill_item', ['idBill', 'idProduct'], { unique: true })
@Check('chk_bill_item_quantity_positive', '"quantity" > 0')
@Check(
  'chk_net_unit_content_value_consistency',
  "(net_unit = 'u' AND content_value IS NULL) OR (net_unit != 'u' AND content_value IS NOT NULL)",
)
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

  @Column({
    name: 'content_value',
    type: 'decimal',
    precision: 10,
    scale: 3,
    unsigned: true,
    nullable: true,
  })
  contentValue: number | null;

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

  @ManyToOne(() => Product, (product) => product.billItems, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_product', referencedColumnName: 'id' })
  product: Product;

  @ManyToOne(() => Bill, (bill) => bill.billItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_bill', referencedColumnName: 'id' })
  bill: Bill;
}
