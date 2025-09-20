import { CreateBillDto } from '@application/dtos/bill/create-bill.dto';
import { UpdateBillDto } from '@application/dtos/bill/update-bill.dto';
import { BillDataSource } from '@domain/datasources/bill.datasource';
import { Bill } from '@domain/entities/bill.entity';
import { BillRepository } from '@domain/repository/bill.repository';

export class BillRepositoryImpl implements BillRepository {
  constructor(private readonly billDataSource: BillDataSource) {}

  create(bill: CreateBillDto): Promise<Bill> {
    return this.billDataSource.create(bill);
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
