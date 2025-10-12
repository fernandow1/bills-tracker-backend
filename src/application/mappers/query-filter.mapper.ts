import { QueryFilterDTO } from '@infrastructure/http/dto/query-filter.dto';
import { IQueryFilter } from '@application/models/query-filter.model';
import { ALLOWED_FIELDS, ALLOWED_OPERATIONS } from '@application/queries/bill/bills-where';
import { Between, Equal, FindOperator, In, LessThan, Like, MoreThan } from 'typeorm';

export function queryMapper(dto: QueryFilterDTO): IQueryFilter {
  const payload: IQueryFilter = {
    page: dto.page ?? 1,
    pageSize: dto.pageSize ?? 10,
    filter: {},
  };

  const raw = dto.filter.trim() ?? '';

  if (!raw) return payload;

  const filters = Array.isArray(dto.filter)
    ? dto.filter
        .filter(Boolean)
        .map((s) => s.trim())
        .filter(Boolean)
    : typeof dto.filter === 'string' && dto.filter.trim()
      ? dto.filter.includes('&')
        ? dto.filter
            .split('&')
            .map((s) => s.trim())
            .filter(Boolean) // por si vino todo en 1 param
        : [dto.filter.trim()]
      : [];

  andBuilder(filters, payload);

  return payload;
}

function andBuilder(filters: string[], { filter }: IQueryFilter): void {
  const andConditions = filters
    .filter((f) => f.includes('.and.'))
    .map((f) => f.split('.and.'))
    .flat();

  for (let i = 0; i < andConditions.length; i++) {
    const element = andConditions[i];
    const [field, operation, value] = element.split('.');

    if (ALLOWED_FIELDS.has(field) && ALLOWED_OPERATIONS.has(operation)) {
      const condition = deciderOperation(
        field,
        operation,
        isNaN(Number(value)) ? value : Number(value),
      );
      if (condition) {
        Object.assign(filter, condition);
      }
    } else {
      continue;
    }
  }
}

function deciderOperation(
  key: string,
  operation: string,
  value: unknown,
): Record<string, FindOperator<unknown> | unknown> | undefined {
  switch (operation) {
    case 'eq':
      return { [key]: Equal(value) };
    case 'in':
      return { [key]: In(Array.isArray(value) ? value : [value]) };
    case 'like':
      return { [key]: Like(value) };
    case 'gt':
      return { [key]: MoreThan(value) };
    case 'lt':
      return { [key]: LessThan(value) };
    case 'between':
      if (Array.isArray(value) && value.length === 2) {
        return { [key]: Between(value[0], value[1]) };
      } else {
        return undefined;
      }
    default:
      return undefined;
  }
}
