import { paymentMethodRepositoryDomainMock } from '../../../infrastructure/datasource/payment-method/payment-method.mock';
import { UpdatePaymentMethod } from './update-payment-method';
import { faker } from '@faker-js/faker';

describe('Update Payment Method Use Case', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('should update a payment method successfully', async () => {
    const uuid = faker.datatype.uuid();
    const repositoryMock = paymentMethodRepositoryDomainMock();

    repositoryMock.getByUuid.mockResolvedValueOnce({ id: 1, uuid } as any);
    repositoryMock.updatePaymentMethod.mockResolvedValueOnce({
      id: 1,
      uuid,
      name: 'Updated Card',
      description: 'Updated payment method',
    } as any);

    const updatePaymentMethodUseCase = new UpdatePaymentMethod(repositoryMock);
    const result = await updatePaymentMethodUseCase.execute(uuid, {
      name: 'Updated Card',
      description: 'Updated payment method',
    });
    expect(result).toHaveProperty('uuid', uuid);
    expect(result).not.toHaveProperty('id');
    expect(result).toHaveProperty('name', 'Updated Card');
    expect(result).toHaveProperty('description', 'Updated payment method');
  });

  test('Should propagate error when repository fails', async () => {
    const uuid = faker.datatype.uuid();
    const repositoryMock = paymentMethodRepositoryDomainMock();
    repositoryMock.getByUuid.mockResolvedValueOnce({ id: 1 } as any);
    repositoryMock.updatePaymentMethod.mockRejectedValueOnce(new Error('Database error'));
    const updatePaymentMethodUseCase = new UpdatePaymentMethod(repositoryMock);

    await expect(
      updatePaymentMethodUseCase.execute(uuid, {
        name: 'Updated Card',
        description: 'Updated payment method',
      }),
    ).rejects.toThrow(new Error('Database error'));
    await expect(repositoryMock.updatePaymentMethod).rejects.toBeInstanceOf(Error);
  });
});
