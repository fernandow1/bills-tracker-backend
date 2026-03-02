import { PaymentMethod } from '@domain/entities/payment-method.entity';

/**
 * Public representation of a Payment Method.
 * Omits the internal numeric `id` and exposes `uuid` as the unique identifier.
 */
export type PaymentMethodPublic = Omit<
  PaymentMethod,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
> & {
  uuid: string; // Expose uuid directly
  createdAt: Date;
  updatedAt: Date;
};

export const PaymentMethodMapper = {
  /**
   * Converts a domain PaymentMethod to its public representation
   */
  toPublic(paymentMethod: PaymentMethod): PaymentMethodPublic | null {
    if (!paymentMethod) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, uuid, deletedAt, ...rest } = paymentMethod;

    return {
      ...rest,
      uuid: uuid as string,
    };
  },

  /**
   * Converts an array of domain PaymentMethods to their public representation
   */
  toPublicArray(paymentMethods: PaymentMethod[]): PaymentMethodPublic[] {
    return paymentMethods.map((pm) => this.toPublic(pm) as PaymentMethodPublic);
  },
};
