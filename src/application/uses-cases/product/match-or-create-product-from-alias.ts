import { ProductAliasRepository } from '@domain/repository/product-alias.repository';
import { ProductRepository } from '@domain/repository/product.repository';
import { MatchStatus } from '@domain/value-objects/match-status.enum';

export interface MatchProductResult {
  idProduct: number;
  matchStatus: MatchStatus;
}

export class MatchOrCreateProductFromAlias {
  constructor(
    private readonly productAliasRepository: ProductAliasRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(
    idShop: number,
    aliasName: string,
    suggestedName: string,
    idCategory: number,
    idBrand: number,
  ): Promise<MatchProductResult> {
    if (!idShop || !aliasName) {
      throw new Error('idShop and aliasName are required to match a product');
    }

    // 1. Buscamos si ya existe el alias asociado a este local
    const existingAlias = await this.productAliasRepository.findByAliasAndShop(aliasName, idShop);

    if (existingAlias) {
      return {
        idProduct: existingAlias.idProduct,
        matchStatus: MatchStatus.EXISTING,
      };
    }

    // 2. Si no existe, revisamos si el "Producto Maestro" ya existe por su nombre real
    const finalProductName =
      suggestedName && suggestedName.trim() !== '' ? suggestedName : aliasName;

    const existingProductByName = await this.productRepository.findByName(finalProductName);

    let masterProductId: number;

    if (existingProductByName) {
      masterProductId = existingProductByName.id;
    } else {
      // 3. Si tampoco existe de manera global, lo creamos
      const newMasterProduct = await this.productRepository.createProduct({
        name: finalProductName,
        idCategory,
        idBrand,
        description: `Auto-generado vía ticket. Alias original: ${aliasName}`,
      });
      masterProductId = newMasterProduct.id;
    }

    // 4. Registramos el nuevo Alias atando el producto nuevo a este supermercado
    await this.productAliasRepository.create({
      idProduct: masterProductId,
      idShop: idShop,
      aliasName: aliasName,
    });

    return {
      idProduct: masterProductId,
      matchStatus: MatchStatus.CREATED,
    };
  }
}
