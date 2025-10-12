import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BillItem } from './bill-item.entity';
import { Shop } from '@infrastructure/database/entities/shop.entity';
import { Currency } from '@infrastructure/database/entities/currency.entity';
import { PaymentMethod } from '@infrastructure/database/entities/payment-method.entity';

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

  @ManyToOne(() => Shop, (shop) => shop.bills)
  @JoinColumn({ name: 'id_shop', referencedColumnName: 'id' })
  shop: Shop;

  @ManyToOne(() => Currency, (currency) => currency.bills)
  @JoinColumn({ name: 'id_currency', referencedColumnName: 'id' })
  currency: Currency;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.bills)
  @JoinColumn({ name: 'id_payment_method', referencedColumnName: 'id' })
  paymentMethod: PaymentMethod;

  @OneToMany(() => BillItem, (billItem) => billItem.bill, {
    cascade: ['soft-remove'],
  })
  billItems: BillItem[];
}
