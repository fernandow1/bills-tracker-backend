import { PaymentMethodDataSource } from '@domain/datasources/payment-method.datasource';
import { CreatePaymentMethodDTO } from '@application/dtos/payment-method/create-payment-method.dto';
import { PaymentMethod } from '@infrastructure/database/entities/payment-method.entity';
import { DataSource } from 'typeorm';

export class PaymentMethodDataSourceImpl implements PaymentMethodDataSource {
  constructor(private readonly dataSource: DataSource) {}

  async updatePaymentMethod(id: number, data: Partial<PaymentMethod>): Promise<PaymentMethod> {
    const existingPaymentMethod = await this.dataSource
      .getRepository(PaymentMethod)
      .findOneOrFail({ where: { id } });

    this.dataSource.getRepository(PaymentMethod).merge(existingPaymentMethod, data);
    return this.dataSource.getRepository(PaymentMethod).save(existingPaymentMethod);
  }

  async deletePaymentMethod(id: number): Promise<void> {
    await this.dataSource.getRepository(PaymentMethod).softDelete(id);
  }
  async createPaymentMethod(data: CreatePaymentMethodDTO): Promise<PaymentMethod> {
    const paymentMethod = this.dataSource.getRepository(PaymentMethod).create(data);
    return this.dataSource.getRepository(PaymentMethod).save(paymentMethod);
  }

  async getAllPaymentMethods(): Promise<PaymentMethod[]> {
    return this.dataSource.getRepository(PaymentMethod).find();
  }
}
