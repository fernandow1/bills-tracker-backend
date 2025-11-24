import { BillRepository } from '@domain/repository/bill.repository';
import { BillItemRepository } from '@domain/repository/bill-item.repository';

/**
 * Unit of Work interface that coordinates transactions across multiple repositories
 * Ensures atomicity - either all operations succeed or all are rolled back
 */
export interface IUnitOfWork {
  /**
   * Access to repositories within the transaction context
   */
  readonly billRepository: BillRepository;
  readonly billItemRepository: BillItemRepository;

  /**
   * Transaction control methods
   */
  beginTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;

  /**
   * Transaction state
   */
  isInTransaction(): boolean;

  /**
   * Cleanup resources (connections, etc.)
   */
  release(): Promise<void>;
}
