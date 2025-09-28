export interface IQueryFilter {
  page: number;
  pageSize: number;
  filter: Record<string, unknown>;
}
