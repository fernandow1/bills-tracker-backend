import { faker } from '@faker-js/faker';
import { paymentMethodRepositoryDomainMock } from '../../../infrastructure/datasource/payment-method/payment-method.mock';
import { DeletePaymentMethod } from './delete-payment-method';

describe('Delete Payment Method Use Case', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('should delete a payment method successfully', async () => {
    const id = faker.datatype.number({ min: 1, max: 1000 });
    const repositoryMock = paymentMethodRepositoryDomainMock();
    const deletePaymentMethodUseCase = new DeletePaymentMethod(repositoryMock);

    await deletePaymentMethodUseCase.execute(id);
    expect(repositoryMock.deletePaymentMethod).toHaveBeenCalledTimes(1);
    expect(repositoryMock.deletePaymentMethod).toHaveBeenCalledWith(id);
  });

  test('Should propagate error when repository fails', async () => {
    const id = faker.datatype.number({ min: 1, max: 1000 });
    const repositoryMock = paymentMethodRepositoryDomainMock();
    repositoryMock.deletePaymentMethod.mockRejectedValueOnce(new Error('Database error'));
    const deletePaymentMethodUseCase = new DeletePaymentMethod(repositoryMock);

    await expect(deletePaymentMethodUseCase.execute(id)).rejects.toThrow('Database error');
    expect(repositoryMock.deletePaymentMethod).toHaveBeenCalledTimes(1);
  });
});
