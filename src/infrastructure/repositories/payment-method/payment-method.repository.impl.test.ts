import { PaymentMethodRepositoryImpl } from './payment-method.repository.impl';
import { PaymentMethodDataSource } from '../../../domain/datasources/payment-method.datasource';
import { PaymentMethod } from '../../../domain/entities/payment-method.entity';
import { CreatePaymentMethodDTO } from '../../../application/dtos/payment-method/create-payment-method.dto';
import {
  PAYMENT_METHOD_MOCK,
  paymentMethodDataSourceDomainMock,
} from '../../datasource/payment-method/payment-method.mock';

describe('PaymentMethodRepositoryImpl', () => {
  let mockDataSource: jest.Mocked<PaymentMethodDataSource>;
  let repository: PaymentMethodRepositoryImpl;

  beforeEach(() => {
    mockDataSource = paymentMethodDataSourceDomainMock();
    repository = new PaymentMethodRepositoryImpl(mockDataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPaymentMethods', () => {
    test('should delegate to datasource and return payment methods', async () => {
      const mockPaymentMethods: PaymentMethod[] = [PAYMENT_METHOD_MOCK, PAYMENT_METHOD_MOCK];
      mockDataSource.getAllPaymentMethods.mockResolvedValue(mockPaymentMethods);

      const result = await repository.getAllPaymentMethods();

      expect(mockDataSource.getAllPaymentMethods).toHaveBeenCalledTimes(1);
      expect(mockDataSource.getAllPaymentMethods).toHaveBeenCalledWith();
      expect(result).toBe(mockPaymentMethods);
    });

    test('should propagate errors from datasource', async () => {
      const error = new Error('Datasource error');
      mockDataSource.getAllPaymentMethods.mockRejectedValue(error);

      await expect(repository.getAllPaymentMethods()).rejects.toThrow(error);
      expect(mockDataSource.getAllPaymentMethods).toHaveBeenCalledTimes(1);
    });
  });

  describe('createPaymentMethod', () => {
    test('should delegate to datasource and return created payment method', async () => {
      const paymentMethodData: CreatePaymentMethodDTO = {
        name: 'Bank Transfer',
        description: 'Payment via bank transfer',
      };
      const createdPaymentMethod: PaymentMethod = { ...PAYMENT_METHOD_MOCK, ...paymentMethodData };
      mockDataSource.createPaymentMethod.mockResolvedValue(createdPaymentMethod);

      const result = await repository.createPaymentMethod(paymentMethodData);

      expect(mockDataSource.createPaymentMethod).toHaveBeenCalledTimes(1);
      expect(mockDataSource.createPaymentMethod).toHaveBeenCalledWith(paymentMethodData);
      expect(result).toBe(createdPaymentMethod);
    });

    test('should propagate errors from datasource', async () => {
      const paymentMethodData = { name: 'Bank Transfer' };
      const error = new Error('Creation failed');
      mockDataSource.createPaymentMethod.mockRejectedValue(error);

      await expect(repository.createPaymentMethod(paymentMethodData)).rejects.toThrow(
        'Creation failed',
      );
      expect(mockDataSource.createPaymentMethod).toHaveBeenCalledWith(paymentMethodData);
    });
  });

  describe('updatePaymentMethod', () => {
    test('should delegate to datasource and return updated payment method', async () => {
      const id = 1;
      const paymentMethodData = { name: 'Updated Payment Method' };
      const updatedPaymentMethod = { ...PAYMENT_METHOD_MOCK, ...paymentMethodData, id };
      mockDataSource.updatePaymentMethod.mockResolvedValue(updatedPaymentMethod);

      const result = await repository.updatePaymentMethod(id, paymentMethodData);

      expect(mockDataSource.updatePaymentMethod).toHaveBeenCalledTimes(1);
      expect(mockDataSource.updatePaymentMethod).toHaveBeenCalledWith(id, paymentMethodData);
      expect(result).toBe(updatedPaymentMethod);
    });

    test('should propagate errors from datasource', async () => {
      const id = 1;
      const paymentMethodData = { name: 'Updated Payment Method' };
      const error = new Error('Update failed');
      mockDataSource.updatePaymentMethod.mockRejectedValue(error);

      await expect(repository.updatePaymentMethod(id, paymentMethodData)).rejects.toThrow(
        'Update failed',
      );
      expect(mockDataSource.updatePaymentMethod).toHaveBeenCalledWith(id, paymentMethodData);
    });
  });

  describe('deletePaymentMethod', () => {
    test('should delegate to datasource successfully', async () => {
      const id = 1;
      mockDataSource.deletePaymentMethod.mockResolvedValue(undefined);

      await repository.deletePaymentMethod(id);

      expect(mockDataSource.deletePaymentMethod).toHaveBeenCalledTimes(1);
      expect(mockDataSource.deletePaymentMethod).toHaveBeenCalledWith(id);
    });

    test('should propagate errors from datasource', async () => {
      const id = 1;
      const error = new Error('Deletion failed');
      mockDataSource.deletePaymentMethod.mockRejectedValue(error);

      await expect(repository.deletePaymentMethod(id)).rejects.toThrow('Deletion failed');
      expect(mockDataSource.deletePaymentMethod).toHaveBeenCalledWith(id);
    });
  });
});
