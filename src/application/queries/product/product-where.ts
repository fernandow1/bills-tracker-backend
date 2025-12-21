export interface ProductWhere {
  id?: number;
  name?: string;
  idCategory?: number;
  idBrand?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const PRODUCT_ALLOWED_FIELDS = new Map<string, { relation?: string; relationField?: string }>([
  ['id', {}],
  ['name', {}],
  ['idCategory', { relation: 'category', relationField: 'id' }],
  ['idBrand', { relation: 'brand', relationField: 'id' }],
]);

export const PRODUCT_ALLOWED_OPERATIONS = new Set(['eq', 'in', 'like']);
