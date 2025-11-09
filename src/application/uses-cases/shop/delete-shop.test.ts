import { faker } from '@faker-js/faker';
import { shopRepositoryDomainMock } from '../../../infrastructure/datasource/shop/shop.mock';
import { DeleteShop } from './delete-shop';

describe('Delete Shop Use Case', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('should delete a shop successfully', async () => {
    const id = faker.datatype.number({ min: 1, max: 1000 });
    const repositoryMock = shopRepositoryDomainMock();
    const deleteShopUseCase = new DeleteShop(repositoryMock);

    await deleteShopUseCase.execute(id);
    expect(repositoryMock.deleteShop).toHaveBeenCalledTimes(1);
    expect(repositoryMock.deleteShop).toHaveBeenCalledWith(id);
  });

  test('Should propagate error when repository fails', async () => {
    const id = faker.datatype.number({ min: 1, max: 1000 });
    const repositoryMock = shopRepositoryDomainMock();
    repositoryMock.deleteShop.mockRejectedValueOnce(new Error('Database error'));
    const deleteShopUseCase = new DeleteShop(repositoryMock);

    await expect(deleteShopUseCase.execute(id)).rejects.toThrow('Database error');
    expect(repositoryMock.deleteShop).toHaveBeenCalledTimes(1);
  });
});
