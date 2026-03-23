import { ExtractedBillDataDTO } from '@domain/dtos/extracted-bill-data.dto';
import { ItemReferenceDTO } from '@domain/dtos/item-reference.dto';

export interface IAIVisionPort {
  extractBillData(
    imageBuffer: Buffer,
    mimeType: string,
    categories: ItemReferenceDTO[],
    brands: ItemReferenceDTO[],
    aiInstructions?: string,
  ): Promise<ExtractedBillDataDTO>;
}
