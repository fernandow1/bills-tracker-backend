import { FindOptionsWhere } from 'typeorm';

export interface IQueryFilter {
  page: number;
  pageSize: number;
  filter: FindOptionsWhere<unknown>;
}
