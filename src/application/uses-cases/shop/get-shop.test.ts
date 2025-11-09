import { GetShops } from './get-shop';
import { shopRepositoryDomainMock } from '../../../infrastructure/datasource/shop/shop.mock';

describe('Get Shops Use Case', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('should return a list of shops', async () => {
    const repositoryMock = shopRepositoryDomainMock();
    const shops = await new GetShops(repositoryMock).execute();
    expect(shops).toBeInstanceOf(Array);
    expect(shops.length).toBeGreaterThan(0);
    shops.forEach((shop) => {
      expect(shop).toHaveProperty('id');
      expect(shop).toHaveProperty('name');
      expect(shop).toHaveProperty('description');
      expect(shop).toHaveProperty('latitude');
      expect(shop).toHaveProperty('longitude');
    });
  });

  test('Should propagate error when repository fails', async () => {
    const repositoryMock = shopRepositoryDomainMock();
    repositoryMock.getAllShops.mockRejectedValueOnce(new Error('Database error'));
    const getShopUseCase = new GetShops(repositoryMock);

    await expect(getShopUseCase.execute()).rejects.toThrow('Database error');
    expect(repositoryMock.getAllShops).toHaveBeenCalledTimes(1);
  });
});
