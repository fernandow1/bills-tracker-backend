import { UpdateBillDto } from '@application/dtos/bill/update-bill.dto';
import { BillRepository } from '@domain/repository/bill.repository';

export interface UpdateBillUseCase {
  execute(id: number, bill: UpdateBillDto): Promise<UpdateBillDto>;
}

export class UpdateBill implements UpdateBillUseCase {
  constructor(private readonly billRepository: BillRepository) {}

  async execute(id: number, bill: UpdateBillDto): Promise<UpdateBillDto> {
    return this.billRepository.update(id, bill);
  }
}
