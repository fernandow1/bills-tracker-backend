import { dataSourceShopMock, shopRepositoryMock } from './shop.mock';
import { ShopDataSourceImpl } from './shop.datasource.impl';
import { Shop } from '../../database/entities/shop.entity';

describe('ShopDatasourceImpl', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
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

    // Verificar que findOneOrFail fue llamado correctamente
    expect(repositoryMock.findOneOrFail).toHaveBeenCalledWith({ where: { id: 1 } });

    // Verificar que merge fue llamado correctamente
    expect(repositoryMock.merge).toHaveBeenCalledTimes(1);

    // Verificar que save fue llamado con el objeto mergeado (que contiene los campos actualizados)
    expect(repositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        name: 'Updated Shop',
        description: 'An updated shop',
      }),
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
