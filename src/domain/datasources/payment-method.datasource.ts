import { CreatePaymentMethodDTO } from '@application/dtos/payment-method/create-payment-method.dto';
import { PaymentMethod } from '@domain/entities/payment-method.entity';

export abstract class PaymentMethodDataSource {
  abstract createPaymentMethod(data: CreatePaymentMethodDTO): Promise<PaymentMethod>;
  abstract getPaymentMethodById(id: number): Promise<PaymentMethod | null>;
  abstract getAllPaymentMethods(): Promise<PaymentMethod[]>;
}
