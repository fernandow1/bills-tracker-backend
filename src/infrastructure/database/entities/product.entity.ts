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
import { Brand } from '@infrastructure/database/entities/brand.entity';
import { Category } from '@infrastructure/database/entities/category.entity';
import { BrandCategory } from '@infrastructure/database/entities/brand-category.entity';

@Index('idx_product_name', ['name'], { unique: true })
@Index('idx_product_id_brand', ['idBrand'])
@Index('idx_product_id_category', ['idCategory'])
@Check('`quantity` >= 0')
@Check('`net_price` >= 0')
@Entity('product')
export class Product {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'id_brand', type: 'int', nullable: false, unsigned: true })
  idBrand: number;

  @Column({ name: 'id_category', type: 'int', nullable: false, unsigned: true })
  idCategory: number;

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false, collation: 'utf8mb4_bin' })
  name: string;

  @Column({ name: 'description', type: 'tinytext', nullable: true, default: null })
  description: string | null;

  @Column({ name: 'net_price', type: 'decimal', precision: 10, scale: 2, nullable: false })
  netPrice: number;

  @Column({ name: 'net_unit', type: 'enum', enum: NetUnits, nullable: false })
  netUnit: NetUnits;

  @Column({ name: 'quantity', type: 'int', nullable: false, unsigned: true })
  quantity: number;

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
    nullable: true,
  })
  deletedAt?: Date | null;

  @ManyToOne(() => Brand, (brand) => brand.products, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_brand', referencedColumnName: 'id' })
  brand: Brand;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_category', referencedColumnName: 'id' })
  category: Category;

  @ManyToOne(() => BrandCategory, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([
    {
      name: 'id_brand',
      referencedColumnName: 'idBrand',
      foreignKeyConstraintName: 'FK_3182397f713e52ec980960d34c7',
    },
    {
      name: 'id_category',
      referencedColumnName: 'idCategory',
      foreignKeyConstraintName: 'FK_1e9aee9ce30ccc28da157f34b40',
    },
  ])
  brandCategory: BrandCategory;
}
