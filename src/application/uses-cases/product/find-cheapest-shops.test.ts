import { ProductPriceByShop } from '../../queries/product/product-price-by-shop.query-result';
import { FindCheapestShops } from './find-cheapest-shops';
import { BillItemRepository } from '../../../domain/repository/bill-item.repository';

describe('FindCheapestShops', () => {
  let useCase: FindCheapestShops;
  let mockRepository: jest.Mocked<BillItemRepository>;

  beforeEach(() => {
    mockRepository = {
      findCheapestShopsByProduct: jest.fn(),
    } as any;

    useCase = new FindCheapestShops(mockRepository);
  });

  describe('execute', () => {
    it('should return shops ordered by price', async () => {
      const mockResults: ProductPriceByShop[] = [
        {
          shopId: 1,
          shopName: 'Shop A',
          latitude: -34.5875,
          longitude: -58.4173,
          lastPrice: 100,
          lastPurchaseDate: new Date('2026-01-20'),
          currency: 'ARS',
        },
        {
          shopId: 2,
          shopName: 'Shop B',
          latitude: -34.6210,
          longitude: -58.3710,
          lastPrice: 150,
          lastPurchaseDate: new Date('2026-01-18'),
          currency: 'ARS',
        },
      ];

      mockRepository.findCheapestShopsByProduct.mockResolvedValue(mockResults);

      const result = await useCase.execute(123);

      expect(result).toEqual(mockResults);
      expect(mockRepository.findCheapestShopsByProduct).toHaveBeenCalledWith(123, {});
    });

    it('should pass options to repository', async () => {
      mockRepository.findCheapestShopsByProduct.mockResolvedValue([]);

      await useCase.execute(123, { maxAgeDays: 30, limit: 10 });

      expect(mockRepository.findCheapestShopsByProduct).toHaveBeenCalledWith(123, {
        maxAgeDays: 30,
        limit: 10,
      });
    });

    it('should throw error for invalid productId', async () => {
      await expect(useCase.execute(0)).rejects.toThrow('Invalid productId');
      await expect(useCase.execute(-1)).rejects.toThrow('Invalid productId');
    });

    it('should throw error for invalid maxAgeDays', async () => {
      await expect(useCase.execute(123, { maxAgeDays: 0 })).rejects.toThrow(
        'maxAgeDays must be greater than 0',
      );
      await expect(useCase.execute(123, { maxAgeDays: -5 })).rejects.toThrow(
        'maxAgeDays must be greater than 0',
      );
    });

    it('should throw error for invalid limit', async () => {
      await expect(useCase.execute(123, { limit: 0 })).rejects.toThrow(
        'limit must be between 1 and 50',
      );
      await expect(useCase.execute(123, { limit: 51 })).rejects.toThrow(
        'limit must be between 1 and 50',
      );
    });

    it('should return empty array when no shops found', async () => {
      mockRepository.findCheapestShopsByProduct.mockResolvedValue([]);

      const result = await useCase.execute(999);

      expect(result).toEqual([]);
    });
  });
});
