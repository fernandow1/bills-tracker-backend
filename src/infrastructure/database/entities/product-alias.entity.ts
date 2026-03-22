import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Product } from '@infrastructure/database/entities/product.entity';
import { Shop } from '@infrastructure/database/entities/shop.entity';

@Entity('product_alias')
@Unique('uq_shop_alias', ['idShop', 'aliasName'])
export class ProductAliasEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id!: number;

  @Column({ name: 'id_product', type: 'int', unsigned: true })
  idProduct!: number;

  @Column({ name: 'id_shop', type: 'int', unsigned: true })
  idShop!: number;

  @Column({ name: 'alias_name', type: 'varchar', length: 255 })
  aliasName!: string;

  /**
   * Relations
   */
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'id_product' })
  product!: Product;

  @ManyToOne(() => Shop)
  @JoinColumn({ name: 'id_shop' })
  shop!: Shop;
}
