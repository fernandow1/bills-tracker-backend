import { UpdatePaymentMethodDTO } from '@application/dtos/payment-method/update-payment-method.dto';
import { PaymentMethodRepository } from '@domain/repository/payment-method.repository';

import {
  PaymentMethodMapper,
  PaymentMethodPublic,
} from '@presentation/payment-method/payment-method.mapper';
import { notFound } from '@presentation/helpers/http-error.helper';

export interface UpdatePaymentMethodUseCase {
  execute(uuid: string, paymentMethod: UpdatePaymentMethodDTO): Promise<PaymentMethodPublic>;
}

export class UpdatePaymentMethod implements UpdatePaymentMethodUseCase {
  constructor(private readonly paymentMethodRepository: PaymentMethodRepository) {}

  async execute(uuid: string, dto: UpdatePaymentMethodDTO): Promise<PaymentMethodPublic> {
    const existing = await this.paymentMethodRepository.getByUuid(uuid);
    if (!existing) throw notFound(`Payment method not found`);

    const updated = await this.paymentMethodRepository.updatePaymentMethod(existing.id, dto);
    return PaymentMethodMapper.toPublic(updated) as PaymentMethodPublic;
  }
}
