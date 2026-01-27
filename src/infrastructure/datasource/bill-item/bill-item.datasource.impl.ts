import { BillItemDataSource } from '@domain/datasources/bill-item.datasource';
import { CreateBillItemDTO } from '@application/dtos/bill-item/create-bill-item.dto';
import { UpdateBillItemDTO } from '@application/dtos/bill-item/update-bill-item.dto';
import { ProductPriceByShop } from '@application/queries/product/product-price-by-shop.query-result';
import { BillItem } from '@infrastructure/database/entities/bill-item.entity';
import { mapProductPriceByShop } from '@infrastructure/mappers/product-price-by-shop.mapper';
import { QueryRunner, DataSource } from 'typeorm';

export class BillItemDatasourceImpl implements BillItemDataSource {
  constructor(private readonly dataSource: DataSource) {}
  async create(billItem: CreateBillItemDTO, transaction?: QueryRunner): Promise<BillItem> {
    const repo = transaction
      ? transaction.manager.getRepository(BillItem)
      : this.dataSource.getRepository(BillItem);
    const billItemToSave = repo.create(billItem);
    return await repo.save(billItemToSave);
  }

  async update(
    id: number,
    billItem: UpdateBillItemDTO,
    transaction?: QueryRunner,
  ): Promise<BillItem> {
    const repo = transaction
      ? transaction.manager.getRepository(BillItem)
      : this.dataSource.getRepository(BillItem);
    const billItemToUpdate = await repo.preload({
      ...billItem,
    });

    if (!billItemToUpdate) {
      throw new Error('BillItem not found');
    }

    return await repo.save(billItemToUpdate);
  }

  async delete(id: number, transaction?: QueryRunner): Promise<void> {
    const repo = transaction
      ? transaction.manager.getRepository(BillItem)
      : this.dataSource.getRepository(BillItem);
    await repo.softDelete(id);
  }

  async findAll(transaction?: QueryRunner): Promise<BillItem[]> {
    const repo = transaction
      ? transaction.manager.getRepository(BillItem)
      : this.dataSource.getRepository(BillItem);
    return await repo.find();
  }

  async findCheapestShopsByProduct(
    productId: number,
    options?: { maxAgeDays?: number; limit?: number },
  ): Promise<ProductPriceByShop[]> {
    const { maxAgeDays, limit = 10 } = options || {};

    // Build query
    let query = `
      SELECT 
        s.id as shop_id,
        s.name as shop_name,
        s.latitude,
        s.longitude,
        bi.net_price as last_price,
        b.purchased_at as last_purchase_date,
        c.code as currency
      FROM bill_item bi
      INNER JOIN bill b ON bi.id_bill = b.id
      INNER JOIN shop s ON b.id_shop = s.id
      INNER JOIN currency c ON b.id_currency = c.id
      WHERE bi.id_product = ?
        AND bi.deleted_at IS NULL
        AND b.deleted_at IS NULL
    `;

    const params: any[] = [productId];

    // Add optional date filter
    if (maxAgeDays !== undefined) {
      query += ` AND b.purchased_at >= DATE_SUB(NOW(), INTERVAL ? DAY)`;
      params.push(maxAgeDays);
    }

    // Order by price (cheapest first), then by most recent purchase
    query += `
      ORDER BY bi.net_price ASC, b.purchased_at DESC
      LIMIT ?
    `;
    params.push(limit);

    // Execute query
    const results = await this.dataSource.query(query, params);

    // Map results
    return results.map((row: any) => mapProductPriceByShop(row));
  }
}
