import { BillItemDataSource } from '@domain/datasources/bill-item.datasource';
import { CreateBillItemDTO } from '@application/dtos/bill-item/create-bill-item.dto';
import { UpdateBillItemDTO } from '@application/dtos/bill-item/update-bill-item.dto';
import { BillItem } from '@infrastructure/database/entities/bill-item.entity';
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
}
