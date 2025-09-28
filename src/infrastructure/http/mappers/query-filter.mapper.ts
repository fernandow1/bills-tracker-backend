import type { IQueryFilter } from '@application/models/query-filter.model';
import type { QueryFilterDTO } from '@infrastructure/http/dto/query-filter.dto';

type MapOpts = { defaults: { page?: number; pageSize?: number } };

export function fromDTOToQueryFilterModel(
  dto: QueryFilterDTO,
  opts: MapOpts = { defaults: {} },
): IQueryFilter {
  const page = clamp(dto.page ?? opts.defaults.page ?? 1, 1, Number.MAX_SAFE_INTEGER);
  const pageSize = clamp(dto.pageSize ?? opts.defaults.pageSize ?? 10, 1, 25);

  const filter = isPlainObject(dto.filter) ? dto.filter : {};

  return { page, pageSize, filter };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    value !== undefined &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}
