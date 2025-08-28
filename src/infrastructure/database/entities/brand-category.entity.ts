import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Brand } from '@infrastructure/database/entities/brand.entity';
import { Category } from '@infrastructure/database/entities/category.entity';

@Entity('brand_category')
export class BrandCategory {
  @PrimaryColumn({ name: 'id_brand', type: 'int', nullable: false, unsigned: true })
  idBrand: number;

  @PrimaryColumn({ name: 'id_category', type: 'int', nullable: false, unsigned: true })
  idCategory: number;

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

  @ManyToOne(() => Brand, (brand) => brand.categories, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_brand', referencedColumnName: 'id' })
  brand: Brand;

  @ManyToOne(() => Category, (category) => category.brandCategories, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_category', referencedColumnName: 'id' })
  category: Category;
}
