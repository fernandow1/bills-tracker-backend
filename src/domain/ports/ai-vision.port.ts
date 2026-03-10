import { BillItem } from '@domain/entities/bill-item.entity';

export interface IAIVisionPort {
  extractBillData(imageBuffer: Buffer, mimeType: string): Promise<Partial<BillItem>[]>;
}
