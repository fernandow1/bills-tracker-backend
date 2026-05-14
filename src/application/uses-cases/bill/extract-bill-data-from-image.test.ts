import { ExtractBillDataFromImage } from './extract-bill-data-from-image';
import { IAIVisionPort } from '../../../domain/ports/ai-vision.port';
import { NetUnits } from '../../../domain/value-objects/net-units.enum';
import { MatchStatus } from '../../../domain/value-objects/match-status.enum';
import { ExtractedBillDataDTO } from '../../../domain/dtos/extracted-bill-data.dto';
import { MatchOrCreateProductFromAlias } from '../product/match-or-create-product-from-alias';
import { CategoryRepository } from '../../../domain/repository/category.repository';
import { BrandRepository } from '../../../domain/repository/brand.repository';

describe('ExtractBillDataFromImage Use Case', () => {
  let extractBillDataFromImage: ExtractBillDataFromImage;
  let mockAiVisionPort: jest.Mocked<IAIVisionPort>;
  let mockMatchOrCreateProductFromAlias: jest.Mocked<MatchOrCreateProductFromAlias>;
  let mockCategoryRepository: jest.Mocked<CategoryRepository>;
  let mockBrandRepository: jest.Mocked<BrandRepository>;

  beforeEach(() => {
    mockAiVisionPort = {
      extractBillData: jest.fn(),
    };
    // Cast to any first to bypass complex constructor mocking in jest for simple tests

    mockMatchOrCreateProductFromAlias = {
      execute: jest.fn(),
    } as any;

    mockCategoryRepository = {
      getAllCategories: jest.fn(),
      createCategory: jest.fn(),
    } as any;

    mockBrandRepository = {
      findAll: jest.fn(),
      create: jest.fn(),
    } as any;

    extractBillDataFromImage = new ExtractBillDataFromImage(
      mockAiVisionPort,
      mockMatchOrCreateProductFromAlias,
      mockCategoryRepository,
      mockBrandRepository,
    );
  });

  it('should successfully extract bill items from an image buffer and run matchers', async () => {
    const mockImageBuffer = Buffer.from('mock-image-data');
    const mockMimeType = 'image/jpeg';

    const mockCategories: any[] = [
      { id: 1, name: 'Limpieza' },
      { id: 2, name: 'Comida' },
    ];
    mockCategoryRepository.getAllCategories.mockResolvedValue(mockCategories);

    const mockBrands: any[] = [{ id: 1, name: 'Genérica' }];
    mockBrandRepository.findAll.mockResolvedValue(mockBrands);

    const expectedExtractedData: ExtractedBillDataDTO = {
      receipt_number: '1234-56789',
      items: [
        {
          alias_name: 'TEST PRODUCT 1',
          suggested_name: 'Test Product',
          quantity: 2,
          net_unit: NetUnits.UNIT,
          content_value: null,
          net_price: 1500,
          id_category: 1,
          suggested_category: null,
          id_brand: 1,
          suggested_brand: null,
          match_status: MatchStatus.NEW,
          id_product: undefined, // Initially before matching
        },
      ],
    };

    mockAiVisionPort.extractBillData.mockResolvedValue(expectedExtractedData);

    // Mock the responses for our matchers
    // Mock the responses for our matchers
    mockMatchOrCreateProductFromAlias.execute.mockResolvedValue({
      idProduct: 99,
      matchStatus: MatchStatus.CREATED,
    });

    const result = await extractBillDataFromImage.execute(mockImageBuffer, mockMimeType, 10);

    expect(mockAiVisionPort.extractBillData).toHaveBeenCalledWith(
      mockImageBuffer,
      mockMimeType,
      mockCategories,
      mockBrands,
      undefined,
      undefined,
    );
    expect(mockMatchOrCreateProductFromAlias.execute).toHaveBeenCalledWith(
      10,
      'TEST PRODUCT 1',
      'Test Product',
      1,
      1,
    );

    expect(result.items[0].id_product).toBe(99);
    expect(result.items[0].match_status).toBe(MatchStatus.CREATED);
  });

  it('should throw an error if imageBuffer is not provided', async () => {
    await expect(extractBillDataFromImage.execute(null as any, 'image/jpeg', 10)).rejects.toThrow(
      'Image buffer and mimeType are required',
    );
  });

  it('should throw an error if mimeType is not provided', async () => {
    await expect(extractBillDataFromImage.execute(Buffer.from('data'), '', 10)).rejects.toThrow(
      'Image buffer and mimeType are required',
    );
  });
});
