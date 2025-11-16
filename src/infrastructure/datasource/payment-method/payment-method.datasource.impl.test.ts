import { dataSourcePaymentMethodMock, paymentMethodRepositoryMock } from './payment-method.mock';
import { PaymentMethodDataSourceImpl } from './payment-method.datasource.impl';
import { PaymentMethod } from '../../database/entities/payment-method.entity';

describe('PaymentMethodDataSourceImpl', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('Should retrieve payment methods from database successfully', async () => {
    const repositoryMock = paymentMethodRepositoryMock();
    const dataSourceMock = dataSourcePaymentMethodMock(repositoryMock);
    const dataSourceImpl = new PaymentMethodDataSourceImpl(dataSourceMock);

    const paymentMethods = await dataSourceImpl.getAllPaymentMethods();

    expect(paymentMethods).toBeInstanceOf(Array);
    expect(paymentMethods.length).toBeGreaterThan(0);
    paymentMethods.forEach((paymentMethod) => {
      expect(paymentMethod).toHaveProperty('id');
      expect(paymentMethod).toHaveProperty('name');
      expect(paymentMethod).toHaveProperty('description');
    });
    expect(dataSourceMock.getRepository).toHaveBeenCalledTimes(1);
    expect(dataSourceMock.getRepository).toHaveBeenCalledWith(PaymentMethod);
    expect(repositoryMock.find).toHaveBeenCalled();
  });

  test('Should propagate error when retrieving payment methods fails', async () => {
    const repositoryMock = paymentMethodRepositoryMock();
    repositoryMock.find.mockRejectedValueOnce(new Error('Database error'));
    const dataSourceMock = dataSourcePaymentMethodMock(repositoryMock);
    const dataSourceImpl = new PaymentMethodDataSourceImpl(dataSourceMock);

    await expect(dataSourceImpl.getAllPaymentMethods()).rejects.toThrow(
      new Error('Database error'),
    );
    expect(dataSourceMock.getRepository).toHaveBeenCalledTimes(1);
    expect(dataSourceMock.getRepository).toHaveBeenCalledWith(PaymentMethod);
    expect(repositoryMock.find).toHaveBeenCalled();
  });

  test('Should create payment method in database successfully', async () => {
    const repositoryMock = paymentMethodRepositoryMock();
    const dataSourceMock = dataSourcePaymentMethodMock(repositoryMock);
    const dataSourceImpl = new PaymentMethodDataSourceImpl(dataSourceMock);

    const newPaymentMethod = await dataSourceImpl.createPaymentMethod({
      name: 'Debit Card',
      description: 'Payment via debit card',
    });

    expect(newPaymentMethod).toBeDefined();
    expect(dataSourceMock.getRepository).toHaveBeenCalledWith(PaymentMethod);
    expect(repositoryMock.create).toHaveBeenCalledTimes(1);
    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
  });

  test('Should propagate error when creating payment method fails', async () => {
    const repositoryMock = paymentMethodRepositoryMock();
    repositoryMock.save.mockRejectedValueOnce(new Error('Creation failed'));
    const dataSourceMock = dataSourcePaymentMethodMock(repositoryMock);
    const dataSourceImpl = new PaymentMethodDataSourceImpl(dataSourceMock);

    await expect(
      dataSourceImpl.createPaymentMethod({
        name: 'Debit Card',
        description: 'Payment via debit card',
      }),
    ).rejects.toThrow('Creation failed');
  });

  test('Should update payment method in database successfully', async () => {
    const repositoryMock = paymentMethodRepositoryMock();
    const dataSourceMock = dataSourcePaymentMethodMock(repositoryMock);
    const dataSourceImpl = new PaymentMethodDataSourceImpl(dataSourceMock);
    const paymentMethodId = 1;

    const updatedPaymentMethod = await dataSourceImpl.updatePaymentMethod(paymentMethodId, {
      name: 'Updated Payment Method',
    });

    expect(updatedPaymentMethod).toBeDefined();
    expect(dataSourceMock.getRepository).toHaveBeenCalledWith(PaymentMethod);
    expect(repositoryMock.findOneOrFail).toHaveBeenCalledWith({ where: { id: paymentMethodId } });
    expect(repositoryMock.merge).toHaveBeenCalledTimes(1);
    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
  });

  test('Should propagate error when updating payment method fails', async () => {
    const repositoryMock = paymentMethodRepositoryMock();
    repositoryMock.findOneOrFail.mockRejectedValueOnce(new Error('PaymentMethod not found'));
    const dataSourceMock = dataSourcePaymentMethodMock(repositoryMock);
    const dataSourceImpl = new PaymentMethodDataSourceImpl(dataSourceMock);

    await expect(
      dataSourceImpl.updatePaymentMethod(1, { name: 'Updated Payment Method' }),
    ).rejects.toThrow('PaymentMethod not found');
  });

  test('Should delete payment method from database successfully', async () => {
    const repositoryMock = paymentMethodRepositoryMock();
    const dataSourceMock = dataSourcePaymentMethodMock(repositoryMock);
    const dataSourceImpl = new PaymentMethodDataSourceImpl(dataSourceMock);
    const paymentMethodId = 1;

    await dataSourceImpl.deletePaymentMethod(paymentMethodId);

    expect(dataSourceMock.getRepository).toHaveBeenCalledWith(PaymentMethod);
    expect(repositoryMock.softDelete).toHaveBeenCalledWith(paymentMethodId);
  });

  test('Should propagate error when deleting payment method fails', async () => {
    const repositoryMock = paymentMethodRepositoryMock();
    repositoryMock.softDelete.mockRejectedValueOnce(new Error('Deletion failed'));
    const dataSourceMock = dataSourcePaymentMethodMock(repositoryMock);
    const dataSourceImpl = new PaymentMethodDataSourceImpl(dataSourceMock);

    await expect(dataSourceImpl.deletePaymentMethod(1)).rejects.toThrow('Deletion failed');
  });
});
