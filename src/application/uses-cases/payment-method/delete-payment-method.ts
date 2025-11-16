import { PaymentMethodRepository } from '@domain/repository/payment-method.repository';

export interface DeletePaymentMethodUseCase {
  execute(id: number): Promise<void>;
}

export class DeletePaymentMethod implements DeletePaymentMethodUseCase {
  constructor(private readonly paymentMethodRepository: PaymentMethodRepository) {}

  execute(id: number): Promise<void> {
    return this.paymentMethodRepository.deletePaymentMethod(id);
  }
}
