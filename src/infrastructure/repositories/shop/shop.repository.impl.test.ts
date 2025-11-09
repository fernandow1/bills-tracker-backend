import { ShopRepositoryImpl } from './shop.repository.impl';
import { ShopDataSource } from '../../../domain/datasources/shop.datasource';
import { Shop } from '../../../domain/entities/shop.entity';
import { SHOPMOCK } from '../../datasource/shop/shop.mock';

// Mock del ShopDataSource
const CREATE_MOCK_DATASOURCE = (): jest.Mocked<ShopDataSource> => ({
  getAllShops: jest.fn(),
  createShop: jest.fn(),
  updateShop: jest.fn(),
  deleteShop: jest.fn(),
});

describe('ShopRepositoryImpl', () => {
  let mockDataSource: jest.Mocked<ShopDataSource>;
  let repository: ShopRepositoryImpl;

  beforeEach(() => {
    mockDataSource = CREATE_MOCK_DATASOURCE();
    repository = new ShopRepositoryImpl(mockDataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllShops', () => {
    test('should delegate to datasource and return shops', async () => {
      const mockShops: Shop[] = [SHOPMOCK, SHOPMOCK];

      mockDataSource.getAllShops.mockResolvedValue(mockShops);

      const result = await repository.getAllShops();

      expect(mockDataSource.getAllShops).toHaveBeenCalledTimes(1);
      expect(mockDataSource.getAllShops).toHaveBeenCalledWith();
      expect(result).toEqual(mockShops);
    });

    test('should propagate error from datasource', async () => {
      const error = new Error('Database error');
      mockDataSource.getAllShops.mockRejectedValue(error);

      await expect(repository.getAllShops()).rejects.toThrow('Database error');
      expect(mockDataSource.getAllShops).toHaveBeenCalledTimes(1);
    });
  });

  describe('createShop', () => {
    test('should delegate to datasource with correct parameters', async () => {
      const shopData = { name: 'New Shop', description: 'Test' };
      const mockCreatedShop = { id: 1, ...shopData } as Shop;
      mockDataSource.createShop.mockResolvedValue(mockCreatedShop);

      const result = await repository.createShop(shopData);

      expect(mockDataSource.createShop).toHaveBeenCalledTimes(1);
      expect(mockDataSource.createShop).toHaveBeenCalledWith(shopData);
      expect(result).toEqual(mockCreatedShop);
    });

    test('should propagate error from datasource', async () => {
      const shopData = { name: 'New Shop' };
      const error = new Error('Creation failed');
      mockDataSource.createShop.mockRejectedValue(error);

      await expect(repository.createShop(shopData)).rejects.toThrow('Creation failed');
      expect(mockDataSource.createShop).toHaveBeenCalledWith(shopData);
    });
  });

  describe('updateShop', () => {
    test('should delegate to datasource with correct parameters', async () => {
      const id = 1;
      const shopData = { name: 'Updated Shop' };
      const mockUpdatedShop = { id, ...shopData } as Shop;
      mockDataSource.updateShop.mockResolvedValue(mockUpdatedShop);

      const result = await repository.updateShop(id, shopData);

      expect(mockDataSource.updateShop).toHaveBeenCalledTimes(1);
      expect(mockDataSource.updateShop).toHaveBeenCalledWith(id, shopData);
      expect(result).toEqual(mockUpdatedShop);
    });

    test('should propagate error from datasource', async () => {
      const id = 1;
      const shopData = { name: 'Updated Shop' };
      const error = new Error('Update failed');
      mockDataSource.updateShop.mockRejectedValue(error);

      await expect(repository.updateShop(id, shopData)).rejects.toThrow('Update failed');
      expect(mockDataSource.updateShop).toHaveBeenCalledWith(id, shopData);
    });
  });

  describe('deleteShop', () => {
    test('should delegate to datasource with correct id', async () => {
      const id = 1;
      mockDataSource.deleteShop.mockResolvedValue(undefined);

      await repository.deleteShop(id);

      expect(mockDataSource.deleteShop).toHaveBeenCalledTimes(1);
      expect(mockDataSource.deleteShop).toHaveBeenCalledWith(id);
    });

    test('should propagate error from datasource', async () => {
      const id = 1;
      const error = new Error('Delete failed');
      mockDataSource.deleteShop.mockRejectedValue(error);

      await expect(repository.deleteShop(id)).rejects.toThrow('Delete failed');
      expect(mockDataSource.deleteShop).toHaveBeenCalledWith(id);
    });
  });
});
