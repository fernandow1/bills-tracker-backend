import { NetUnits } from '@domain/value-objects/net-units.enum';

import { MatchStatus } from '@domain/value-objects/match-status.enum';

export interface ExtractedBillItemDTO {
  alias_name: string;
  suggested_name: string;
  quantity: number;
  net_unit: NetUnits;
  content_value: number | null;
  net_price: number;
  id_category: number | null;
  suggested_category: string | null;
  id_brand: number | null;
  suggested_brand: string | null;
  match_status: MatchStatus | string;
  id_product?: number;
}

export interface ExtractedBillDataDTO {
  receipt_number: string | null;
  items: ExtractedBillItemDTO[];
}
