import { CreateBillDto } from '@application/dtos/bill/create-bill.dto';
import { Bill } from '@domain/entities/bill.entity';
import { BillRepository } from '@domain/repository/bill.repository';

export interface CreateBillUseCase {
  execute(billData: CreateBillDto): Promise<Bill>;
}

export class CreateBill implements CreateBillUseCase {
  constructor(private readonly billRepository: BillRepository) {}

  async execute(billData: CreateBillDto): Promise<Bill> {
    return this.billRepository.create(billData);
  }
}
