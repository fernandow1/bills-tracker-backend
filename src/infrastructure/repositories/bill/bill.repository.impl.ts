import { CreateBillDto } from '@application/dtos/bill/create-bill.dto';
import { UpdateBillDto } from '@application/dtos/bill/update-bill.dto';
import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';
import { BillDataSource } from '@domain/datasources/bill.datasource';
import { Bill } from '@domain/entities/bill.entity';
import { BillRepository } from '@domain/repository/bill.repository';

export class BillRepositoryImpl implements BillRepository {
  constructor(private readonly billDataSource: BillDataSource) {}

  create(bill: CreateBillDto): Promise<Bill> {
    return this.billDataSource.create(bill);
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

  update(id: number, bill: UpdateBillDto): Promise<UpdateBillDto> {
    return this.billDataSource.update(id, bill);
  }

  delete(id: number): Promise<void> {
    return this.billDataSource.delete(id);
  }
}
