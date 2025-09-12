import { CreateBillItemDTO } from '@application/dtos/bill-item/create-bill-item.dto';
import { UpdateBillItemDTO } from '@application/dtos/bill-item/update-bill-item.dto';
import { BillItem } from '@domain/entities/bill-item.entity';
import { QueryRunner } from 'typeorm';

export abstract class BillItemRepository {
  abstract create(billItem: CreateBillItemDTO, transaction?: QueryRunner): Promise<BillItem>;
  abstract update(
    id: number,
    billItem: UpdateBillItemDTO,
    transaction?: QueryRunner,
  ): Promise<BillItem>;
  abstract delete(id: number, transaction?: QueryRunner): Promise<void>;
  abstract findAll(transaction?: QueryRunner): Promise<BillItem[]>;
}
