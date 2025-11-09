import { dataSourceShopMock, shopRepositoryMock } from './shop.mock';
import { ShopDataSourceImpl } from './shop.datasource.impl';
import { Shop } from '../../database/entities/shop.entity';

describe('ShopDatasourceImpl', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('Should be retrieve shops from database successfully', async () => {
    const repositoryMock = shopRepositoryMock();
    const dataSourceMock = dataSourceShopMock(repositoryMock);
    const dataSourceImpl = new ShopDataSourceImpl(dataSourceMock);

    const shops = await dataSourceImpl.getAllShops();

    expect(shops).toBeInstanceOf(Array);
    expect(shops.length).toBeGreaterThan(0);
    shops.forEach((shop) => {
      expect(shop).toHaveProperty('id');
      expect(shop).toHaveProperty('name');
      expect(shop).toHaveProperty('description');
      expect(shop).toHaveProperty('latitude');
      expect(shop).toHaveProperty('longitude');
    });
    expect(dataSourceMock.getRepository).toHaveBeenCalledTimes(1);
    expect(dataSourceMock.getRepository).toHaveBeenCalledWith(Shop);
    expect(repositoryMock.find).toHaveBeenCalled();
  });

  test('Should propagate error when retrieving shops fails', async () => {
    const repositoryMock = shopRepositoryMock();
    repositoryMock.find.mockRejectedValueOnce(new Error('Database error'));
    const dataSourceMock = dataSourceShopMock(repositoryMock);
    const dataSourceImpl = new ShopDataSourceImpl(dataSourceMock);

    await expect(dataSourceImpl.getAllShops()).rejects.toThrow(new Error('Database error'));
    expect(dataSourceMock.getRepository).toHaveBeenCalledTimes(1);
    expect(dataSourceMock.getRepository).toHaveBeenCalledWith(Shop);
    expect(repositoryMock.find).toHaveBeenCalled();
  });

  test('Should be create shop in database successfully', async () => {
    const repositoryMock = shopRepositoryMock();
    const dataSourceMock = dataSourceShopMock(repositoryMock);
    const dataSourceImpl = new ShopDataSourceImpl(dataSourceMock);

    const newShop = await dataSourceImpl.createShop({
      name: 'New Shop',
      description: 'A new shop',
    });

    expect(newShop).toBeDefined();
    expect(dataSourceMock.getRepository).toHaveBeenCalledWith(Shop);
    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    expect(repositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'New Shop', description: 'A new shop' }),
    );
  });

  test('Should propagate error when creating shop fails', async () => {
    const repositoryMock = shopRepositoryMock();
    repositoryMock.save.mockRejectedValueOnce(new Error('Database error'));
    const dataSourceMock = dataSourceShopMock(repositoryMock);
    const dataSourceImpl = new ShopDataSourceImpl(dataSourceMock);

    await expect(
      dataSourceImpl.createShop({
        name: 'New Shop',
        description: 'A new shop',
      }),
    ).rejects.toThrow(new Error('Database error'));
  });

  test('Should be update shop in database successfully', async () => {
    const repositoryMock = shopRepositoryMock();
    const dataSourceMock = dataSourceShopMock(repositoryMock);
    const dataSourceImpl = new ShopDataSourceImpl(dataSourceMock);

    const updatedShop = await dataSourceImpl.updateShop(1, {
      name: 'Updated Shop',
      description: 'An updated shop',
    });

    expect(updatedShop).toBeDefined();
    expect(dataSourceMock.getRepository).toHaveBeenCalledWith(Shop);
    expect(repositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, name: 'Updated Shop', description: 'An updated shop' }),
    );
  });

  test('Should propagate error when updating shop fails', async () => {
    const repositoryMock = shopRepositoryMock();
    repositoryMock.save.mockRejectedValueOnce(new Error('Database error'));
    const dataSourceMock = dataSourceShopMock(repositoryMock);
    const dataSourceImpl = new ShopDataSourceImpl(dataSourceMock);

    await expect(
      dataSourceImpl.updateShop(1, {
        name: 'Updated Shop',
        description: 'An updated shop',
      }),
    ).rejects.toThrow(new Error('Database error'));
  });

  test('Should be delete shop in database successfully', async () => {
    const repositoryMock = shopRepositoryMock();
    const dataSourceMock = dataSourceShopMock(repositoryMock);
    const dataSourceImpl = new ShopDataSourceImpl(dataSourceMock);

    await dataSourceImpl.deleteShop(1);

    expect(dataSourceMock.getRepository).toHaveBeenCalledWith(Shop);
    expect(repositoryMock.softDelete).toHaveBeenCalledWith(1);
    expect(repositoryMock.softDelete).toHaveBeenCalledTimes(1);
  });

  test('Should propagate error when deleting shop fails', async () => {
    const repositoryMock = shopRepositoryMock();
    repositoryMock.softDelete.mockRejectedValueOnce(new Error('Database error'));
    const dataSourceMock = dataSourceShopMock(repositoryMock);
    const dataSourceImpl = new ShopDataSourceImpl(dataSourceMock);

    await expect(dataSourceImpl.deleteShop(1)).rejects.toThrow(new Error('Database error'));
  });
});
