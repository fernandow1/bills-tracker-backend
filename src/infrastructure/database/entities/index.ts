import { BillItem } from '@infrastructure/database/entities/bill-item.entity';
import { Bill } from '@infrastructure/database/entities/bill.entity';
import { BrandCategory } from '@infrastructure/database/entities/brand-category.entity';
import { Brand } from '@infrastructure/database/entities/brand.entity';
import { Category } from '@infrastructure/database/entities/category.entity';
import { Currency } from '@infrastructure/database/entities/currency.entity';
import { PaymentMethod } from '@infrastructure/database/entities/payment-method.entity';
import { Product } from '@infrastructure/database/entities/product.entity';
import { Shop } from '@infrastructure/database/entities/shop.entity';
import { User } from '@infrastructure/database/entities/user.entity';

export const DATABASE_ENTITIES = [
  BillItem,
  Bill,
  BrandCategory,
  Brand,
  Category,
  Currency,
  PaymentMethod,
  Product,
  Shop,
  User,
];
