import { GetPaymentsMethod } from './get-payment-methods';
import { paymentMethodRepositoryDomainMock } from '../../../infrastructure/datasource/payment-method/payment-method.mock';

describe('Get Payment Methods Use Case', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('should return a list of payment methods', async () => {
    const repositoryMock = paymentMethodRepositoryDomainMock();
    const paymentMethods = await new GetPaymentsMethod(repositoryMock).execute();

    expect(paymentMethods).toBeInstanceOf(Array);
    expect(paymentMethods.length).toBeGreaterThan(0);
    paymentMethods.forEach((paymentMethod) => {
      expect(paymentMethod).toHaveProperty('id');
      expect(paymentMethod).toHaveProperty('name');
      expect(paymentMethod).toHaveProperty('description');
    });
  });

  test('Should propagate error when repository fails', async () => {
    const repositoryMock = paymentMethodRepositoryDomainMock();
    repositoryMock.getAllPaymentMethods.mockRejectedValueOnce(new Error('Database error'));
    const getPaymentMethodsUseCase = new GetPaymentsMethod(repositoryMock);

    await expect(getPaymentMethodsUseCase.execute()).rejects.toThrow('Database error');
    expect(repositoryMock.getAllPaymentMethods).toHaveBeenCalledTimes(1);
  });
});
