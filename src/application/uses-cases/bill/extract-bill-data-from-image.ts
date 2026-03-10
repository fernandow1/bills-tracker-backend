import { IAIVisionPort } from '@domain/ports/ai-vision.port';
import { BillItem } from '@domain/entities/bill-item.entity';

export class ExtractBillDataFromImage {
  constructor(private readonly aiVisionPort: IAIVisionPort) {}

  async execute(imageBuffer: Buffer, mimeType: string): Promise<Partial<BillItem>[]> {
    if (!imageBuffer || !mimeType) {
      throw new Error('Image buffer and mimeType are required');
    }

    const items = await this.aiVisionPort.extractBillData(imageBuffer, mimeType);

    // Add any necessary business logic or validations here.
    return items;
  }
}
