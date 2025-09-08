import { BillItemDataSource } from '@domain/datasources/bill-item.datasource';
import { CreateBillItemDTO } from '@application/dtos/bill-item/create-bill-item.dto';
import { UpdateBillItemDTO } from '@application/dtos/bill-item/update-bill-item.dto';
import { AppDataSource } from '@infrastructure/database/connection';
import { BillItem } from '@infrastructure/database/entities/bill-item.entity';

export class BillItemDatasourceImpl implements BillItemDataSource {
  async create(billItem: CreateBillItemDTO): Promise<BillItem> {
    const billItemToSave = AppDataSource.getRepository(BillItem).create(billItem);
    return await AppDataSource.getRepository(BillItem).save(billItemToSave);
  }

  async update(id: number, billItem: UpdateBillItemDTO): Promise<BillItem> {
    const billItemToUpdate = await AppDataSource.getRepository(BillItem).preload({
      id,
      ...billItem,
    });

    if (!billItemToUpdate) {
      throw new Error('BillItem not found');
    }

    return await AppDataSource.getRepository(BillItem).save(billItemToUpdate);
  }

  async delete(id: number): Promise<void> {
    await AppDataSource.getRepository(BillItem).softDelete(id);
  }

  async findAll(): Promise<BillItem[]> {
    return await AppDataSource.getRepository(BillItem).find();
  }
}
