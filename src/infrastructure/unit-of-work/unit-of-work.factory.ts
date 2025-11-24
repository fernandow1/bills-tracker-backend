import { IUnitOfWork } from '@domain/ports/unit-of-work.interface';
import { TypeOrmUnitOfWork } from '@infrastructure/unit-of-work/typeorm-unit-of-work';
import { AppDataSource } from '@infrastructure/database/connection';

/**
 * Creates a new Unit of Work instance
 * @returns Fresh UnitOfWork instance ready to begin transactions
 */
export const CREATE_UNIT_OF_WORK = (): IUnitOfWork => {
  return new TypeOrmUnitOfWork(AppDataSource);
};

/**
 * Creates a function that returns new UnitOfWork instances
 * Useful for dependency injection in use cases
 * @returns Factory function that creates UnitOfWork instances
 */
export const CREATE_UNIT_OF_WORK_FACTORY = (): (() => IUnitOfWork) => {
  return () => CREATE_UNIT_OF_WORK();
};
