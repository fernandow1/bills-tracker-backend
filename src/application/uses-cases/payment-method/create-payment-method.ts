import { CreatePaymentMethodDTO } from '@application/dtos/payment-method/create-payment-method.dto';
import { PaymentMethod } from '@domain/entities/payment-method.entity';
import { PaymentMethodRepository } from '@domain/repository/payment-method.repository';

export interface CreatePaymentMethodUseCase {
  execute(paymentMethod: CreatePaymentMethodDTO): Promise<PaymentMethod>;
}

export class CreatePaymentMethod implements CreatePaymentMethodUseCase {
  constructor(private readonly paymentMethodRepository: PaymentMethodRepository) {}

  execute(paymentMethod: CreatePaymentMethodDTO): Promise<PaymentMethod> {
    return this.paymentMethodRepository.createPaymentMethod(paymentMethod);
  }
}
