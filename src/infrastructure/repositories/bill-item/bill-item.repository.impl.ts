import { CreateBillItemDTO } from '@application/dtos/bill-item/create-bill-item.dto';
import { UpdateBillItemDTO } from '@application/dtos/bill-item/update-bill-item.dto';
import { ProductPriceByShop } from '@application/queries/product/product-price-by-shop.query-result';
import { BillItemDataSource } from '@domain/datasources/bill-item.datasource';
import { BillItem } from '@domain/entities/bill-item.entity';
import { BillItemRepository } from '@domain/repository/bill-item.repository';
import { QueryRunner } from 'typeorm';

export class BillItemRepositoryImpl implements BillItemRepository {
  constructor(
    private readonly billItemDataSource: BillItemDataSource,
    private readonly queryRunner?: QueryRunner,
  ) {}

  create(billItem: CreateBillItemDTO, transaction?: QueryRunner): Promise<BillItem> {
    const txn = transaction || this.queryRunner;
    return this.billItemDataSource.create(billItem, txn);
  }

  update(id: number, billItem: UpdateBillItemDTO, transaction?: QueryRunner): Promise<BillItem> {
    const txn = transaction || this.queryRunner;
    return this.billItemDataSource.update(id, billItem, txn);
  }

  delete(id: number, transaction?: QueryRunner): Promise<void> {
    const txn = transaction || this.queryRunner;
    return this.billItemDataSource.delete(id, txn);
  }

  findAll(transaction?: QueryRunner): Promise<BillItem[]> {
    const txn = transaction || this.queryRunner;
    return this.billItemDataSource.findAll(txn);
  }

  findCheapestShopsByProduct(
    productId: number,
    options?: { maxAgeDays?: number; limit?: number },
  ): Promise<ProductPriceByShop[]> {
    return this.billItemDataSource.findCheapestShopsByProduct(productId, options);
  }
}
