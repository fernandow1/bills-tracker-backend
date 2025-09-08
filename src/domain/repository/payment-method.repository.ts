import { CreatePaymentMethodDTO } from '@application/dtos/payment-method/create-payment-method.dto';
import { PaymentMethod } from '@domain/entities/payment-method.entity';

export abstract class PaymentMethodRepository {
  abstract createPaymentMethod(data: CreatePaymentMethodDTO): Promise<PaymentMethod>;
  abstract getAllPaymentMethods(): Promise<PaymentMethod[]>;
}
