import { shopRepositoryDomainMock } from '../../../infrastructure/datasource/shop/shop.mock';
import { UpdateShop } from './update-shop';
import { faker } from '@faker-js/faker';

describe('Update Shop Use Case', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('should update a shop successfully', async () => {
    const id = faker.datatype.number({ min: 1, max: 1000 });
    const repositoryMock = shopRepositoryDomainMock();
    const updateShopUseCase = new UpdateShop(repositoryMock);
    const result = await updateShopUseCase.execute(id, {
      name: 'Updated Shop',
      description: 'An updated shop',
    });
    expect(result).toHaveProperty('id', id);
    expect(result).toHaveProperty('name', 'Updated Shop');
    expect(result).toHaveProperty('description', 'An updated shop');
  });

  test('Should propagate error when repository fails', async () => {
    const id = faker.datatype.number({ min: 1, max: 1000 });
    const repositoryMock = shopRepositoryDomainMock();
    repositoryMock.updateShop.mockRejectedValueOnce(new Error('Database error'));
    const updateShopUseCase = new UpdateShop(repositoryMock);

    await expect(
      updateShopUseCase.execute(id, {
        name: 'Updated Shop',
        description: 'An updated shop',
      }),
    ).rejects.toThrow(new Error('Database error'));
    await expect(repositoryMock.updateShop).rejects.toBeInstanceOf(Error);
  });
});
