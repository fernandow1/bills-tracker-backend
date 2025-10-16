import { QueryFilterDTO } from '@infrastructure/http/dto/query-filter.dto';
import { IQueryFilter } from '@application/models/query-filter.model';
import { ALLOWED_FIELDS, ALLOWED_OPERATIONS } from '@application/queries/bill/bills-where';
import {
  Between,
  Equal,
  FindOperator,
  FindOptionsWhere,
  In,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
} from 'typeorm';

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
      : [dto.filter.trim()];

  andBuilder(filters, payload);

  return payload;
}

function andBuilder(filters: string[], { filter }: IQueryFilter): void {
  const conditionsMap = new Map<string, unknown>();

  let andConditions: string[] = [];
  andConditions = filters
    .filter((f) => f.includes('.and.'))
    .map((f) => f.split('.and.'))
    .flat();

  if (!andConditions.length) {
    andConditions = filters;
  }

  for (let i = 0; i < andConditions.length; i++) {
    const element = andConditions[i];
    const [field, operation] = element.split('.');
    let value: unknown = element.split('.')[2];
    // Validate commas in value for 'in' operation
    if (operation === 'in' && typeof value === 'string') {
      const values = value.split(',').map((v) => Number(v.trim()));
      if (values.length > 0) {
        value = values.filter((v) => !isNaN(v));
      }
    }

    if (ALLOWED_FIELDS.has(field) && ALLOWED_OPERATIONS.has(operation)) {
      const { relation } = ALLOWED_FIELDS.get(field) || {};

      const condition = deciderOperation(field, operation, value);

      if (relation && typeof relation === 'string') {
        if (!conditionsMap.has(relation)) {
          conditionsMap.set(relation, condition);
        } else {
          const existingConditions = conditionsMap.get(relation) as FindOptionsWhere<unknown>;
          Object.assign(existingConditions, condition);
          conditionsMap.set(relation, existingConditions);
        }
        Object.assign(filter, Object.fromEntries(conditionsMap));
      } else {
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
    case 'gte':
      return { [key]: MoreThanOrEqual(value) };
    case 'lte':
      return { [key]: LessThanOrEqual(value) };
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
