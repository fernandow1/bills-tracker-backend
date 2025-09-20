import { BillItemDataSource } from '@domain/datasources/bill-item.datasource';
import { CreateBillItemDTO } from '@application/dtos/bill-item/create-bill-item.dto';
import { UpdateBillItemDTO } from '@application/dtos/bill-item/update-bill-item.dto';
import { AppDataSource } from '@infrastructure/database/connection';
import { BillItem } from '@infrastructure/database/entities/bill-item.entity';
import { QueryRunner } from 'typeorm';

export class BillItemDatasourceImpl implements BillItemDataSource {
  async create(billItem: CreateBillItemDTO, transaction?: QueryRunner): Promise<BillItem> {
    const repo = transaction
      ? transaction.manager.getRepository(BillItem)
      : AppDataSource.getRepository(BillItem);
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
      : AppDataSource.getRepository(BillItem);
    const billItemToUpdate = await repo.preload({
      ...billItem,
    });

    if (!billItemToUpdate) {
      throw new Error('BillItem not found');
    }

    return await AppDataSource.getRepository(BillItem).save(billItemToUpdate);
  }

  async delete(id: number, transaction?: QueryRunner): Promise<void> {
    const repo = transaction
      ? transaction.manager.getRepository(BillItem)
      : AppDataSource.getRepository(BillItem);
    await repo.softDelete(id);
  }

  async findAll(transaction?: QueryRunner): Promise<BillItem[]> {
    const repo = transaction
      ? transaction.manager.getRepository(BillItem)
      : AppDataSource.getRepository(BillItem);
    return await repo.find();
  }
}
