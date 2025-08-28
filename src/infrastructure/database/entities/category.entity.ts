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
import { BrandCategory } from '@infrastructure/database/entities/brand-category.entity';
import { Product } from '@infrastructure/database/entities/product.entity';

@Index('idx_category_name', ['name'], { unique: true })
@Entity('category')
export class Category {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100, nullable: false, collation: 'utf8mb4_bin' })
  name: string;

  @Column({ name: 'description', type: 'tinytext', nullable: true, default: null })
  description: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(0)',
    precision: 0,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(0)',
    onUpdate: 'CURRENT_TIMESTAMP(0)',
    precision: 0,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    default: null,
    precision: 0,
  })
  deletedAt: Date | null;

  @OneToMany(() => BrandCategory, (brandCategory) => brandCategory.category)
  brandCategories: BrandCategory[];

  products: Product[];
}
