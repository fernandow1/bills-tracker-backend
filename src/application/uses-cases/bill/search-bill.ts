import { Pagination } from '@application/models/pagination.model';
import { IQueryFilter } from '@application/models/query-filter.model';
import { Bill } from '@domain/entities/bill.entity';
import { BillRepository } from '@domain/repository/bill.repository';

interface SearchUseCase {
  execute(filter: IQueryFilter): Promise<Pagination<Bill>>;
}

export class SearchBill implements SearchUseCase {
  constructor(private readonly billRepository: BillRepository) {}

  async execute(filter: IQueryFilter): Promise<Pagination<Bill>> {
    const { count, data } = await this.billRepository.search(filter);
    return {
      count,
      data,
    };
  }
}
