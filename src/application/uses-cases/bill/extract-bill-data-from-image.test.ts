import { ExtractBillDataFromImage } from './extract-bill-data-from-image';
import { IAIVisionPort } from '../../../domain/ports/ai-vision.port';
import { BillItem } from '../../../domain/entities/bill-item.entity';
import { NetUnits } from '../../../domain/value-objects/net-units.enum';

describe('ExtractBillDataFromImage Use Case', () => {
  let extractBillDataFromImage: ExtractBillDataFromImage;
  let mockAiVisionPort: jest.Mocked<IAIVisionPort>;

  beforeEach(() => {
    mockAiVisionPort = {
      extractBillData: jest.fn(),
    };
    extractBillDataFromImage = new ExtractBillDataFromImage(mockAiVisionPort);
  });

  it('should successfully extract bill items from an image buffer', async () => {
    const mockImageBuffer = Buffer.from('mock-image-data');
    const mockMimeType = 'image/jpeg';

    const expectedExtractedData: Partial<BillItem>[] = [
      {
        idProduct: 0,
        quantity: 2,
        netPrice: 1500,
        netUnit: NetUnits.UNIT,
      },
    ];

    mockAiVisionPort.extractBillData.mockResolvedValue(expectedExtractedData);

    const result = await extractBillDataFromImage.execute(mockImageBuffer, mockMimeType);

    expect(mockAiVisionPort.extractBillData).toHaveBeenCalledWith(mockImageBuffer, mockMimeType);
    expect(result).toEqual(expectedExtractedData);
  });

  it('should throw an error if imageBuffer is not provided', async () => {
    await expect(extractBillDataFromImage.execute(null as any, 'image/jpeg')).rejects.toThrow(
      'Image buffer and mimeType are required',
    );
  });

  it('should throw an error if mimeType is not provided', async () => {
    await expect(extractBillDataFromImage.execute(Buffer.from('data'), '')).rejects.toThrow(
      'Image buffer and mimeType are required',
    );
  });
});
