import { PaymentMethodDataSource } from '@domain/datasources/payment-method.datasource';
import { CreatePaymentMethodDTO } from '@application/dtos/payment-method/create-payment-method.dto';
import { PaymentMethod } from '@domain/entities/payment-method.entity';
import { PaymentMethodRepository } from '@domain/repository/payment-method.repository';

export class PaymentMethodRepositoryImpl implements PaymentMethodRepository {
  private readonly paymentMethodDataSource: PaymentMethodDataSource;

  constructor(paymentMethodDataSource: PaymentMethodDataSource) {
    this.paymentMethodDataSource = paymentMethodDataSource;
  }

  async updatePaymentMethod(id: number, data: Partial<PaymentMethod>): Promise<PaymentMethod> {
    return this.paymentMethodDataSource.updatePaymentMethod(id, data);
  }

  async deletePaymentMethod(id: number): Promise<void> {
    return this.paymentMethodDataSource.deletePaymentMethod(id);
  }

  async createPaymentMethod(paymentMethod: CreatePaymentMethodDTO): Promise<PaymentMethod> {
    return this.paymentMethodDataSource.createPaymentMethod(paymentMethod);
  }

  async getAllPaymentMethods(): Promise<PaymentMethod[]> {
    return this.paymentMethodDataSource.getAllPaymentMethods();
  }
}
