import { BillRepository } from '@domain/repository/bill.repository';

export interface DeleteBillUseCase {
  execute(id: number): Promise<void>;
}

export class DeleteBill implements DeleteBillUseCase {
  constructor(private readonly billRepository: BillRepository) {}

  async execute(id: number): Promise<void> {
    await this.billRepository.delete(id);
  }
}
