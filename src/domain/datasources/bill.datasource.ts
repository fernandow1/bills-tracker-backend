import { CreateBillDto } from '@application/dtos/bill/create-bill.dto';
import { UpdateBillDto } from '@application/dtos/bill/update-bill.dto';
import { Bill } from '@domain/entities/bill.entity';

export abstract class BillDataSource {
  abstract create(bill: CreateBillDto): Promise<Bill>;
  abstract findById(id: number): Promise<Bill | null>;
  abstract findAll(): Promise<Bill[]>;
  abstract update(id: number, bill: UpdateBillDto): Promise<UpdateBillDto>;
  abstract delete(id: number): Promise<void>;
}
