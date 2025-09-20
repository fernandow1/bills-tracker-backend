import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BillItem } from './bill-item.entity';

@Entity('bill')
export class Bill {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'id_shop', type: 'int', unsigned: true })
  idShop: number;

  @Column({ name: 'id_currency', type: 'int', unsigned: true })
  idCurrency: number;

  @Column({ name: 'id_payment_method', type: 'int', unsigned: true })
  idPaymentMethod: number;

  @Column({ name: 'id_user', type: 'int', unsigned: true })
  idUser: number;

  @Column({ name: 'total', type: 'decimal', precision: 10, scale: 2, unsigned: true })
  total: number;

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

  @OneToMany(() => BillItem, (billItem) => billItem.bill, {
    cascade: ['soft-remove'],
  })
  billItems: BillItem[];
}
