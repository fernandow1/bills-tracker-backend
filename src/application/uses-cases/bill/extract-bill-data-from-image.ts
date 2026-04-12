import { IAIVisionPort } from '@domain/ports/ai-vision.port';
import { ExtractedBillDataDTO } from '@domain/dtos/extracted-bill-data.dto';
import { MatchOrCreateProductFromAlias } from '@application/uses-cases/product/match-or-create-product-from-alias';
import { CategoryRepository } from '@domain/repository/category.repository';
import { BrandRepository } from '@domain/repository/brand.repository';

export class ExtractBillDataFromImage {
  constructor(
    private readonly aiVisionPort: IAIVisionPort,
    private readonly matchOrCreateProductFromAlias: MatchOrCreateProductFromAlias,
    private readonly categoryRepository: CategoryRepository,
    private readonly brandRepository: BrandRepository,
  ) {}

  async execute(
    imageBuffer: Buffer,
    mimeType: string,
    idShop: number,
    aiInstructions?: string,
  ): Promise<ExtractedBillDataDTO> {
    if (!imageBuffer || !mimeType) {
      throw new Error('Image buffer and mimeType are required');
    }

    const categories = await this.categoryRepository.getAllCategories();
    const formattedCategories = categories.map((c) => ({ id: c.id, name: c.name }));

    const brands = await this.brandRepository.findAll();
    const formattedBrands = brands.map((b) => ({ id: b.id, name: b.name }));

    const aiData = await this.aiVisionPort.extractBillData(
      imageBuffer,
      mimeType,
      formattedCategories,
      formattedBrands,
      aiInstructions,
    );

    // 1. (Omitido) El ID del comercio ya viene directamente desde el controlador

    // 2. Por cada item del ticket, matcheamos su alias usando el idShop
    for (const item of aiData.items) {
      if (item.id_category === null) {
        const newCategoryName = item.suggested_category?.trim() || 'Sin Categoría';
        const existingCategory = categories.find(
          (c) => c.name.toLowerCase() === newCategoryName.toLowerCase(),
        );

        if (existingCategory) {
          item.id_category = existingCategory.id;
        } else {
          const newCategory = await this.categoryRepository.createCategory({
            name: newCategoryName,
            description: '',
          });
          item.id_category = newCategory.id;
          categories.push({ id: newCategory.id, name: newCategory.name } as any);
        }
      }

      if (item.id_brand === null) {
        const newBrandName = item.suggested_brand?.trim() || 'Genérica';
        const existingBrand = brands.find(
          (b) => b.name.toLowerCase() === newBrandName.toLowerCase(),
        );

        if (existingBrand) {
          item.id_brand = existingBrand.id;
        } else {
          const newBrand = await this.brandRepository.create({ name: newBrandName });
          item.id_brand = newBrand.id;
          brands.push({ id: newBrand.id, name: newBrand.name } as any);
        }
      }

      const matchResult = await this.matchOrCreateProductFromAlias.execute(
        idShop,
        item.alias_name,
        item.suggested_name,
        item.id_category as number,
        item.id_brand as number,
      );

      item.id_product = matchResult.idProduct;
      item.match_status = matchResult.matchStatus;
    }

    return aiData;
  }
}
