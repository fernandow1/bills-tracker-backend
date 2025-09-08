import { CreateBillItemDTO } from '@application/dtos/bill-item/create-bill-item.dto';
import { UpdateBillItemDTO } from '@application/dtos/bill-item/update-bill-item.dto';
import { BillItem } from '@domain/entities/bill-item.entity';

export abstract class BillItemDataSource {
  abstract create(billItem: CreateBillItemDTO): Promise<BillItem>;
  abstract update(id: number, billItem: UpdateBillItemDTO): Promise<BillItem>;
  abstract delete(id: number): Promise<void>;
  abstract findAll(): Promise<BillItem[]>;
}
