import { PaymentMethodDataSource } from '@domain/datasources/payment-method.datasource';
import { CreatePaymentMethodDTO } from '@domain/dtos/payment-method/create-payment-method.dto';
import { PaymentMethod } from '@domain/entities/payment-method.entity';
import { PaymentMethodRepository } from '@domain/repository/payment-method.repository';

export class PaymentMethodRepositoryImpl implements PaymentMethodRepository {
  private readonly paymentMethodDataSource: PaymentMethodDataSource;

  constructor(paymentMethodDataSource: PaymentMethodDataSource) {
    this.paymentMethodDataSource = paymentMethodDataSource;
  }

  async createPaymentMethod(paymentMethod: CreatePaymentMethodDTO): Promise<PaymentMethod> {
    return this.paymentMethodDataSource.createPaymentMethod(paymentMethod);
  }

  async getAllPaymentMethods(): Promise<PaymentMethod[]> {
    return this.paymentMethodDataSource.getAllPaymentMethods();
  }
}
