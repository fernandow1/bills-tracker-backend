import { CreateShop } from './create-shop';
import { shopRepositoryDomainMock } from '../../../infrastructure/datasource/shop/shop.mock';

describe('Create Shop Use Case', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('should create a new shop successfully', async () => {
    const repositoryMock = shopRepositoryDomainMock();
    const createShopUseCase = new CreateShop(repositoryMock);

    const result = await createShopUseCase.execute({
      name: 'New Shop',
      description: 'A new shop',
    });

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name', 'New Shop');
    expect(result).toHaveProperty('description', 'A new shop');
    expect(repositoryMock.createShop).toHaveBeenCalledTimes(1);
    expect(repositoryMock.createShop).toHaveBeenCalledWith({
      name: 'New Shop',
      description: 'A new shop',
    });
  });

  test('Should propagate error when repository fails', async () => {
    const repositoryMock = shopRepositoryDomainMock();
    repositoryMock.createShop.mockRejectedValueOnce(new Error('Database error'));
    const createShopUseCase = new CreateShop(repositoryMock);

    await expect(
      createShopUseCase.execute({
        name: 'New Shop',
        description: 'A new shop',
      }),
    ).rejects.toThrow('Database error');
    expect(repositoryMock.createShop).toHaveBeenCalledTimes(1);
  });
});
