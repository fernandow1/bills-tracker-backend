import { paymentMethodRepositoryDomainMock } from '../../../infrastructure/datasource/payment-method/payment-method.mock';
import { UpdatePaymentMethod } from './update-payment-method';
import { faker } from '@faker-js/faker';

describe('Update Payment Method Use Case', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('should update a payment method successfully', async () => {
    const id = faker.datatype.number({ min: 1, max: 1000 });
    const repositoryMock = paymentMethodRepositoryDomainMock();
    const updatePaymentMethodUseCase = new UpdatePaymentMethod(repositoryMock);
    const result = await updatePaymentMethodUseCase.execute(id, {
      name: 'Updated Card',
      description: 'Updated payment method',
    });
    expect(result).toHaveProperty('id', id);
    expect(result).toHaveProperty('name', 'Updated Card');
    expect(result).toHaveProperty('description', 'Updated payment method');
  });

  test('Should propagate error when repository fails', async () => {
    const id = faker.datatype.number({ min: 1, max: 1000 });
    const repositoryMock = paymentMethodRepositoryDomainMock();
    repositoryMock.updatePaymentMethod.mockRejectedValueOnce(new Error('Database error'));
    const updatePaymentMethodUseCase = new UpdatePaymentMethod(repositoryMock);

    await expect(
      updatePaymentMethodUseCase.execute(id, {
        name: 'Updated Card',
        description: 'Updated payment method',
      }),
    ).rejects.toThrow(new Error('Database error'));
    await expect(repositoryMock.updatePaymentMethod).rejects.toBeInstanceOf(Error);
  });
});
