import { PaymentMethodRepository } from '@domain/repository/payment-method.repository';

import {
  PaymentMethodMapper,
  PaymentMethodPublic,
} from '@presentation/payment-method/payment-method.mapper';

export interface GetPaymentsMethodUseCase {
  execute(): Promise<PaymentMethodPublic[]>;
}

export class GetPaymentsMethod implements GetPaymentsMethodUseCase {
  constructor(private readonly paymentMethodRepository: PaymentMethodRepository) {}

  async execute(): Promise<PaymentMethodPublic[]> {
    const methods = await this.paymentMethodRepository.getAllPaymentMethods();
    return PaymentMethodMapper.toPublicArray(methods);
  }
}
