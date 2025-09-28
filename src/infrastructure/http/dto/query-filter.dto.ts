import { IQueryFilter } from '@application/models/query-filter.model';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class QueryFilterDTO implements IQueryFilter {
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'Page must be a number' },
  )
  @Min(1, { message: 'Page must be at least $constraint1' })
  page: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'Page size must be a number' },
  )
  @Min(1, { message: 'Page size must be at least $constraint1' })
  @Max(25, { message: 'Page size must be at most $constraint1' })
  pageSize: number;

  @IsOptional()
  filter: Record<string, unknown>;
}
