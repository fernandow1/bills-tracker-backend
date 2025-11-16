import { UpdatePaymentMethodDTO } from '@application/dtos/payment-method/update-payment-method.dto';
import { PaymentMethodRepository } from '@domain/repository/payment-method.repository';
import { PaymentMethod } from '@domain/entities/payment-method.entity';

export interface UpdatePaymentMethodUseCase {
  execute(id: number, paymentMethod: UpdatePaymentMethodDTO): Promise<PaymentMethod>;
}

export class UpdatePaymentMethod implements UpdatePaymentMethodUseCase {
  constructor(private readonly paymentMethodRepository: PaymentMethodRepository) {}

  execute(id: number, paymentMethod: UpdatePaymentMethodDTO): Promise<PaymentMethod> {
    return this.paymentMethodRepository.updatePaymentMethod(id, paymentMethod);
  }
}
