import { Bill } from '@domain/entities/bill.entity';
import { BillRepository } from '@domain/repository/bill.repository';

export interface GetBillsUseCase {
  execute(): Promise<Bill[]>;
}

export class GetBills implements GetBillsUseCase {
  constructor(private readonly billRepository: BillRepository) {}

  async execute(): Promise<Bill[]> {
    return this.billRepository.findAll();
  }
}
