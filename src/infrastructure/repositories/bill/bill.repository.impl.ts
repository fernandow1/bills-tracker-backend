import { CreateBillDto } from '@application/dtos/bill/create-bill.dto';
import { UpdateBillDto } from '@application/dtos/bill/update-bill.dto';
import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';
import { BillDataSource } from '@domain/datasources/bill.datasource';
import { Bill } from '@domain/entities/bill.entity';
import { BillRepository } from '@domain/repository/bill.repository';
import { QueryRunner } from 'typeorm';

export class BillRepositoryImpl implements BillRepository {
  constructor(
    private readonly billDataSource: BillDataSource,
    private readonly queryRunner?: QueryRunner,
  ) {}

  create(bill: CreateBillDto, transaction?: QueryRunner): Promise<Bill> {
    const txn = transaction || this.queryRunner;
    return this.billDataSource.create(bill, txn);
  }

  search(filter: IQueryFilter): Promise<Pagination<Bill>> {
    return this.billDataSource.search(filter);
  }

  findById(id: number): Promise<Bill | null> {
    return this.billDataSource.findById(id);
  }

  findAll(): Promise<Bill[]> {
    return this.billDataSource.findAll();
  }

  update(id: number, bill: UpdateBillDto, transaction?: QueryRunner): Promise<UpdateBillDto> {
    const txn = transaction || this.queryRunner;
    return this.billDataSource.update(id, bill, txn);
  }

  delete(id: number, transaction?: QueryRunner): Promise<void> {
    const txn = transaction || this.queryRunner;
    return this.billDataSource.delete(id, txn);
  }
}
