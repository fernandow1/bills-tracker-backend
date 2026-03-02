import { faker } from '@faker-js/faker';
import { paymentMethodRepositoryDomainMock } from '../../../infrastructure/datasource/payment-method/payment-method.mock';
import { DeletePaymentMethod } from './delete-payment-method';

describe('Delete Payment Method Use Case', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('should delete a payment method successfully', async () => {
    const uuid = faker.datatype.uuid();
    const repositoryMock = paymentMethodRepositoryDomainMock();
    const deletePaymentMethodUseCase = new DeletePaymentMethod(repositoryMock);

    await deletePaymentMethodUseCase.execute(uuid);
    expect(repositoryMock.getByUuid).toHaveBeenCalledWith(uuid);
    expect(repositoryMock.deletePaymentMethod).toHaveBeenCalledTimes(1);
    expect(repositoryMock.deletePaymentMethod).toHaveBeenCalledWith(1);
  });

  test('Should propagate error when repository fails', async () => {
    const uuid = faker.datatype.uuid();
    const repositoryMock = paymentMethodRepositoryDomainMock();
    repositoryMock.getByUuid.mockResolvedValueOnce({ id: 1 } as any);
    repositoryMock.deletePaymentMethod.mockRejectedValueOnce(new Error('Database error'));
    const deletePaymentMethodUseCase = new DeletePaymentMethod(repositoryMock);

    await expect(deletePaymentMethodUseCase.execute(uuid)).rejects.toThrow('Database error');
    expect(repositoryMock.deletePaymentMethod).toHaveBeenCalledTimes(1);
  });
});
