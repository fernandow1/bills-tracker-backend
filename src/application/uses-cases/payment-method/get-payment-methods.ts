import { PaymentMethod } from '@domain/entities/payment-method.entity';
import { PaymentMethodRepository } from '@domain/repository/payment-method.repository';

export interface GetPaymentsMethodUseCase {
  execute(): Promise<PaymentMethod[]>;
}

export class GetPaymentsMethod implements GetPaymentsMethodUseCase {
  constructor(private readonly paymentMethodRepository: PaymentMethodRepository) {}

  async execute(): Promise<PaymentMethod[]> {
    return this.paymentMethodRepository.getAllPaymentMethods();
  }
}
