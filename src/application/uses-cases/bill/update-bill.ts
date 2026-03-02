import { UpdateBillDto } from '@application/dtos/bill/update-bill.dto';
import { BillRepository } from '@domain/repository/bill.repository';
import { PaymentMethodRepository } from '@domain/repository/payment-method.repository';
import { notFound } from '@presentation/helpers/http-error.helper';

export interface UpdateBillUseCase {
  execute(id: number, bill: UpdateBillDto): Promise<UpdateBillDto>;
}

export class UpdateBill implements UpdateBillUseCase {
  constructor(
    private readonly billRepository: BillRepository,
    private readonly paymentMethodRepository: PaymentMethodRepository,
  ) {}

  async execute(id: number, bill: UpdateBillDto): Promise<UpdateBillDto> {
    const { uuidPaymentMethod, ...rest } = bill;
    const internalBillData: any = { ...rest };

    if (uuidPaymentMethod) {
      const paymentMethod = await this.paymentMethodRepository.getByUuid(uuidPaymentMethod);
      if (!paymentMethod) throw notFound('Payment method not found');
      internalBillData.idPaymentMethod = paymentMethod.id;
    }

    return this.billRepository.update(id, internalBillData as any);
  }
}
