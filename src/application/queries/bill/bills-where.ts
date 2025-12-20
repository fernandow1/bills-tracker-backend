export interface BillsWhere {
  id?: number;
  idShop?: number;
  idCurrency?: number;
  idPaymentMethod?: number;
  total?: number;
  idProduct?: number;
  createdAt?: Date; // Only Bill field
  updatedAt?: Date; // Only Bill field
}

export const BILL_ALLOWED_FIELDS = new Map<string, { relation?: string }>([
  ['idProduct', { relation: 'billItems' }],
  ['idShop', {}],
  ['idCurrency', {}],
  ['idPaymentMethod', {}],
  ['total', {}],
]);

/**
 * Set of allowed operations for filtering.
 *
 * Available operators:
 * - **eq**: Equal
 * - **in**: Value is in an array
 * - **like**: String contains a pattern (similar to SQL LIKE)
 * - **gt**: Greater than
 * - **lt**: Less than
 * - **between**: Value is within a range (inclusive)
 */
export const BILL_ALLOWED_OPERATIONS = new Set([
  'eq',
  'in',
  'like',
  'gt',
  'lt',
  'gte',
  'lte',
  'between',
]);

// Mantener compatibilidad hacia atrás
export const ALLOWED_FIELDS = BILL_ALLOWED_FIELDS;
export const ALLOWED_OPERATIONS = BILL_ALLOWED_OPERATIONS;
