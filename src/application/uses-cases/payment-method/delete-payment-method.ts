import { PaymentMethodRepository } from '@domain/repository/payment-method.repository';

import { notFound } from '@presentation/helpers/http-error.helper';

export interface DeletePaymentMethodUseCase {
  execute(uuid: string): Promise<void>;
}

export class DeletePaymentMethod implements DeletePaymentMethodUseCase {
  constructor(private readonly paymentMethodRepository: PaymentMethodRepository) {}

  async execute(uuid: string): Promise<void> {
    const paymentMethod = await this.paymentMethodRepository.getByUuid(uuid);
    if (!paymentMethod) throw notFound(`Payment method not found`);

    return this.paymentMethodRepository.deletePaymentMethod(paymentMethod.id);
  }
}
