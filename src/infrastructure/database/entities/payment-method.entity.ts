import {
  BeforeInsert,
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
import { v7 as uuidv7 } from 'uuid';

@Entity('payment_method')
export class PaymentMethod {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Index({ unique: true })
  @Column({
    name: 'uuid',
    type: 'binary',
    length: 16,
    nullable: true,
    transformer: {
      to: (value: string | null) => (value ? Buffer.from(value.replace(/-/g, ''), 'hex') : null),
      from: (value: Buffer | null) =>
        value
          ? value.toString('hex').replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5')
          : null,
    },
  })
  uuid?: string;

  @Column({ name: 'name', type: 'varchar', length: 150, nullable: false, unique: true })
  name: string;

  @Column({ name: 'description', type: 'tinytext', nullable: true })
  description: string | null;

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
    onUpdate: 'CURRENT_TIMESTAMP(0)',
    precision: 0,
    nullable: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    default: null,
    precision: 0,
  })
  deletedAt: Date | null;

  @OneToMany(() => Bill, (bill) => bill.paymentMethod)
  bills: Bill[];

  @BeforeInsert()
  generateUuid(): void {
    if (!this.uuid) {
      this.uuid = uuidv7();
    }
  }
}
