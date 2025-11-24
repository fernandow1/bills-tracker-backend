import { CreateBillDto } from '@application/dtos/bill/create-bill.dto';
import { UpdateBillDto } from '@application/dtos/bill/update-bill.dto';
import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';
import { Bill } from '@domain/entities/bill.entity';
import { QueryRunner } from 'typeorm';

export abstract class BillRepository {
  abstract create(bill: CreateBillDto, transaction?: QueryRunner): Promise<Bill>;
  abstract search(filter: IQueryFilter): Promise<Pagination<Bill>>;
  abstract findById(id: number): Promise<Bill | null>;
  abstract findAll(): Promise<Bill[]>;
  abstract update(
    id: number,
    bill: UpdateBillDto,
    transaction?: QueryRunner,
  ): Promise<UpdateBillDto>;
  abstract delete(id: number, transaction?: QueryRunner): Promise<void>;
}
