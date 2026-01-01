import { CreateBillDto } from '@application/dtos/bill/create-bill.dto';
import { Bill } from '@domain/entities/bill.entity';
import { IUnitOfWork } from '@domain/ports/unit-of-work.interface';

export interface CreateBillWithUoWUseCase {
  execute(billData: CreateBillDto): Promise<Bill>;
}

/**
 * Create Bill use case using Unit of Work pattern
 * Provides explicit transaction management and business logic separation
 */
export class CreateBillWithUoW implements CreateBillWithUoWUseCase {
  constructor(private readonly unitOfWorkFactory: () => IUnitOfWork) {}

  async execute(billData: CreateBillDto): Promise<Bill> {
    const unitOfWork = this.unitOfWorkFactory();

    try {
      await unitOfWork.beginTransaction();

      // Validate business rules
      await this.validateBusinessRules(billData);

      // Separate bill data from items
      const { billItems, ...billInfo } = billData;

      // Create the bill first
      const createdBill = await unitOfWork.billRepository.create({
        ...billInfo,
        billItems: [], // Create bill without items initially
      });

      // Create bill items with reference to the created bill
      // Using sequential execution to maintain transaction integrity
      if (billItems && billItems.length > 0) {
        for await (const itemDto of billItems) {
          await unitOfWork.billItemRepository.create({
            ...itemDto,
            idBill: createdBill.id,
          });
        }
      }

      await unitOfWork.commit();
      return createdBill;
    } catch (error) {
      await unitOfWork.rollback();
      throw error;
    } finally {
      await unitOfWork.release();
    }
  }

  private async validateBusinessRules(billData: CreateBillDto): Promise<void> {
    const tolerance = 0.01;

    // Validate that billItems exist
    if (!billData.billItems || billData.billItems.length === 0) {
      throw new Error('Bill must have at least one item');
    }

    // Calculate subTotal from billItems (netPrice * quantity for each item)
    const calculatedSubTotal = billData.billItems.reduce(
      (sum, item) => sum + item.netPrice * item.quantity,
      0,
    );

    // Validate that subTotal matches sum of items (netPrice * quantity)
    if (Math.abs(calculatedSubTotal - billData.subTotal) > tolerance) {
      throw new Error(
        `SubTotal mismatch: expected ${billData.subTotal}, calculated ${calculatedSubTotal}. SubTotal must equal the sum of all items netPrice`,
      );
    }

    // Validate that total = subTotal - discount
    const calculatedTotal = billData.subTotal - billData.discount;
    if (Math.abs(calculatedTotal - billData.total) > tolerance) {
      throw new Error(
        `Total mismatch: expected ${billData.total}, calculated ${calculatedTotal}. Total must equal subTotal - discount`,
      );
    }

    // Validate discount is not negative
    if (billData.discount < 0) {
      throw new Error('Discount cannot be negative');
    }

    // Validate discount is not greater than subTotal
    if (billData.discount > billData.subTotal) {
      throw new Error('Discount cannot be greater than subTotal');
    }

    // Validate total is not negative
    if (billData.total < 0) {
      throw new Error('Total cannot be negative');
    }

    // Validate no duplicate products in the same bill
    if (billData.billItems.length > 1) {
      const productIds = billData.billItems.map((item) => item.idProduct);
      const uniqueProductIds = new Set(productIds);

      if (productIds.length !== uniqueProductIds.size) {
        throw new Error('Duplicate products are not allowed in the same bill');
      }
    }
  }
}
