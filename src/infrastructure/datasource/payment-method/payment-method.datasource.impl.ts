import { PaymentMethodDataSource } from '@domain/datasources/payment-method.datasource';
import { CreatePaymentMethodDTO } from '@application/dtos/payment-method/create-payment-method.dto';
import { AppDataSource } from '@infrastructure/database/connection';
import { PaymentMethod } from '@infrastructure/database/entities/payment-method.entity';

export class PaymentMethodDataSourceImpl implements PaymentMethodDataSource {
  async createPaymentMethod(data: CreatePaymentMethodDTO): Promise<PaymentMethod> {
    return AppDataSource.getRepository(PaymentMethod).save(data);
  }

  async getPaymentMethodById(id: number): Promise<PaymentMethod | null> {
    return AppDataSource.getRepository(PaymentMethod).findOneBy({ id });
  }

  async getAllPaymentMethods(): Promise<PaymentMethod[]> {
    return AppDataSource.getRepository(PaymentMethod).find();
  }
}
