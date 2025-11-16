import { CreatePaymentMethodDTO } from '@application/dtos/payment-method/create-payment-method.dto';
import { PaymentMethod } from '@domain/entities/payment-method.entity';

export abstract class PaymentMethodDataSource {
  abstract createPaymentMethod(data: CreatePaymentMethodDTO): Promise<PaymentMethod>;
  abstract getAllPaymentMethods(): Promise<PaymentMethod[]>;
  abstract updatePaymentMethod(id: number, data: Partial<PaymentMethod>): Promise<PaymentMethod>;
  abstract deletePaymentMethod(id: number): Promise<void>;
}
