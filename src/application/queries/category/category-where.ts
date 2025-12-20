export interface CategoryWhere {
  id?: number;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const CATEGORY_ALLOWED_FIELDS = new Map<string, { relation?: string }>([
  ['id', {}],
  ['name', {}],
]);

/**
 * Set of allowed operations for filtering categories.
 *
 * Available operators:
 * - **eq**: Equal
 * - **in**: Value is in an array
 * - **like**: String contains a pattern (similar to SQL LIKE)
 * - **gt**: Greater than
 * - **lt**: Less than
 * - **gte**: Greater than or equal
 * - **lte**: Less than or equal
 * - **between**: Value is within a range (inclusive)
 */
export const CATEGORY_ALLOWED_OPERATIONS = new Set([
  'eq',
  'in',
  'like',
  'gt',
  'lt',
  'gte',
  'lte',
  'between',
]);
