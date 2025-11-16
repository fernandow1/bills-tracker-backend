import { CreatePaymentMethod } from './create-payment-method';
import { paymentMethodRepositoryDomainMock } from '../../../infrastructure/datasource/payment-method/payment-method.mock';

describe('Create Payment Method Use Case', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('should create a new payment method successfully', async () => {
    const repositoryMock = paymentMethodRepositoryDomainMock();
    const createPaymentMethodUseCase = new CreatePaymentMethod(repositoryMock);

    const result = await createPaymentMethodUseCase.execute({
      name: 'Credit Card',
      description: 'Payment via credit card',
    });

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name', 'Credit Card');
    expect(result).toHaveProperty('description', 'Payment via credit card');
    expect(repositoryMock.createPaymentMethod).toHaveBeenCalledTimes(1);
    expect(repositoryMock.createPaymentMethod).toHaveBeenCalledWith({
      name: 'Credit Card',
      description: 'Payment via credit card',
    });
  });

  test('Should propagate error when repository fails', async () => {
    const repositoryMock = paymentMethodRepositoryDomainMock();
    repositoryMock.createPaymentMethod.mockRejectedValueOnce(new Error('Database error'));
    const createPaymentMethodUseCase = new CreatePaymentMethod(repositoryMock);

    await expect(
      createPaymentMethodUseCase.execute({
        name: 'Credit Card',
        description: 'Payment via credit card',
      }),
    ).rejects.toThrow('Database error');
    expect(repositoryMock.createPaymentMethod).toHaveBeenCalledTimes(1);
  });
});
