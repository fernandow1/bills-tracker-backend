export interface BrandWhere {
  id?: number;
  name?: string;
  idCategory?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const BRAND_ALLOWED_FIELDS = new Map<string, { relation?: string }>([
  ['id', {}],
  ['name', {}],
  ['idCategory', { relation: 'brandCategories' }],
]);

/**
 * Set of allowed operations for filtering brands.
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
export const BRAND_ALLOWED_OPERATIONS = new Set([
  'eq',
  'in',
  'like',
  'gt',
  'lt',
  'gte',
  'lte',
  'between',
]);
