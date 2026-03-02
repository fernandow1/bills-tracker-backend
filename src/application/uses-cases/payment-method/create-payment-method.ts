import { CreatePaymentMethodDTO } from '@application/dtos/payment-method/create-payment-method.dto';
import { PaymentMethod } from '@domain/entities/payment-method.entity';
import { PaymentMethodRepository } from '@domain/repository/payment-method.repository';

import {
  PaymentMethodMapper,
  PaymentMethodPublic,
} from '@presentation/payment-method/payment-method.mapper';

export interface CreatePaymentMethodUseCase {
  execute(paymentMethod: CreatePaymentMethodDTO): Promise<PaymentMethodPublic>;
}

export class CreatePaymentMethod implements CreatePaymentMethodUseCase {
  constructor(private readonly paymentMethodRepository: PaymentMethodRepository) {}

  async execute(paymentMethod: CreatePaymentMethodDTO): Promise<PaymentMethodPublic> {
    const created = await this.paymentMethodRepository.createPaymentMethod(paymentMethod);
    return PaymentMethodMapper.toPublic(created) as PaymentMethodPublic;
  }
}
