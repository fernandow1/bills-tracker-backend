import { IUnitOfWork } from '@domain/ports/unit-of-work.interface';
import { BillRepository } from '@domain/repository/bill.repository';
import { BillItemRepository } from '@domain/repository/bill-item.repository';
import { BillRepositoryImpl } from '@infrastructure/repositories/bill/bill.repository.impl';
import { BillItemRepositoryImpl } from '@infrastructure/repositories/bill-item/bill-item.repository.impl';
import { BillDataSourceImpl } from '@infrastructure/datasource/bill/bill.datasource.impl';
import { BillItemDatasourceImpl } from '@infrastructure/datasource/bill-item/bill-item.datasource.impl';
import { DataSource, QueryRunner } from 'typeorm';

/**
 * TypeORM implementation of Unit of Work pattern
 * Coordinates transactions across multiple repositories
 */
export class TypeOrmUnitOfWork implements IUnitOfWork {
  private queryRunner: QueryRunner | null = null;
  private _billRepository: BillRepository | null = null;
  private _billItemRepository: BillItemRepository | null = null;

  constructor(private readonly dataSource: DataSource) {}

  async beginTransaction(): Promise<void> {
    if (this.queryRunner) {
      throw new Error('Transaction already active. Call rollback or commit first.');
    }

    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  async commit(): Promise<void> {
    if (!this.queryRunner) {
      throw new Error('No active transaction to commit. Call beginTransaction first.');
    }

    try {
      await this.queryRunner.commitTransaction();
    } finally {
      await this.cleanup();
    }
  }

  async rollback(): Promise<void> {
    if (!this.queryRunner) {
      // Silent rollback if no active transaction
      return;
    }

    try {
      await this.queryRunner.rollbackTransaction();
    } finally {
      await this.cleanup();
    }
  }

  async release(): Promise<void> {
    await this.cleanup();
  }

  isInTransaction(): boolean {
    return this.queryRunner !== null && this.queryRunner.isTransactionActive;
  }

  get billRepository(): BillRepository {
    if (!this.queryRunner) {
      throw new Error('No active transaction. Call beginTransaction first.');
    }

    if (!this._billRepository) {
      const billDataSource = new BillDataSourceImpl(this.dataSource);
      this._billRepository = new BillRepositoryImpl(billDataSource, this.queryRunner);
    }

    return this._billRepository;
  }

  get billItemRepository(): BillItemRepository {
    if (!this.queryRunner) {
      throw new Error('No active transaction. Call beginTransaction first.');
    }

    if (!this._billItemRepository) {
      const billItemDataSource = new BillItemDatasourceImpl(this.dataSource);
      this._billItemRepository = new BillItemRepositoryImpl(billItemDataSource, this.queryRunner);
    }

    return this._billItemRepository;
  }

  private async cleanup(): Promise<void> {
    if (this.queryRunner) {
      await this.queryRunner.release();
      this.queryRunner = null;
    }

    // Reset repositories to force recreation with new transaction
    this._billRepository = null;
    this._billItemRepository = null;
  }
}
