export interface ShopWhere {
  id?: number;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const SHOP_ALLOWED_FIELDS = new Map<string, { relation?: string; relationField?: string }>([
  ['id', {}],
  ['name', {}],
]);

export const SHOP_ALLOWED_OPERATIONS = new Set(['eq', 'in', 'like']);
