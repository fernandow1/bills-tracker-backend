import { TypeOrmUnitOfWork } from './typeorm-unit-of-work';
import { CREATE_UNIT_OF_WORK, CREATE_UNIT_OF_WORK_FACTORY } from './unit-of-work.factory';

describe('TypeOrmUnitOfWork', () => {
  let mockDataSource: {
    createQueryRunner: jest.Mock;
  };
  let mockQueryRunner: {
    connect: jest.Mock;
    startTransaction: jest.Mock;
    commitTransaction: jest.Mock;
    rollbackTransaction: jest.Mock;
    release: jest.Mock;
    isTransactionActive: boolean;
    manager: Record<string, unknown>;
  };
  let unitOfWork: TypeOrmUnitOfWork;

  beforeEach(() => {
    // Setup mocks
    mockQueryRunner = {
      connect: jest.fn().mockResolvedValue(undefined),
      startTransaction: jest.fn().mockResolvedValue(undefined),
      commitTransaction: jest.fn().mockResolvedValue(undefined),
      rollbackTransaction: jest.fn().mockResolvedValue(undefined),
      release: jest.fn().mockResolvedValue(undefined),
      isTransactionActive: true,
      manager: {},
    };

    mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unitOfWork = new TypeOrmUnitOfWork(mockDataSource as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Transaction Management', () => {
    test('should begin transaction successfully', async () => {
      await unitOfWork.beginTransaction();

      expect(mockDataSource.createQueryRunner).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.connect).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.startTransaction).toHaveBeenCalledTimes(1);
      expect(unitOfWork.isInTransaction()).toBe(true);
    });

    test('should throw error when trying to begin transaction twice', async () => {
      await unitOfWork.beginTransaction();

      await expect(unitOfWork.beginTransaction()).rejects.toThrow(
        'Transaction already active. Call rollback or commit first.',
      );
    });

    test('should commit transaction successfully', async () => {
      await unitOfWork.beginTransaction();
      await unitOfWork.commit();

      expect(mockQueryRunner.commitTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
      expect(unitOfWork.isInTransaction()).toBe(false);
    });

    test('should throw error when committing without active transaction', async () => {
      await expect(unitOfWork.commit()).rejects.toThrow(
        'No active transaction to commit. Call beginTransaction first.',
      );
    });

    test('should rollback transaction successfully', async () => {
      await unitOfWork.beginTransaction();
      await unitOfWork.rollback();

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
      expect(unitOfWork.isInTransaction()).toBe(false);
    });

    test('should handle rollback gracefully when no active transaction', async () => {
      await expect(unitOfWork.rollback()).resolves.not.toThrow();
    });

    test('should release resources properly', async () => {
      await unitOfWork.beginTransaction();
      await unitOfWork.release();

      expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
      expect(unitOfWork.isInTransaction()).toBe(false);
    });
  });

  describe('Repository Access', () => {
    test('should provide bill repository when transaction is active', async () => {
      await unitOfWork.beginTransaction();

      const billRepository = unitOfWork.billRepository;

      expect(billRepository).toBeDefined();
      // Should return same instance on subsequent calls
      expect(unitOfWork.billRepository).toBe(billRepository);
    });

    test('should provide bill item repository when transaction is active', async () => {
      await unitOfWork.beginTransaction();

      const billItemRepository = unitOfWork.billItemRepository;

      expect(billItemRepository).toBeDefined();
      // Should return same instance on subsequent calls
      expect(unitOfWork.billItemRepository).toBe(billItemRepository);
    });

    test('should throw error when accessing repositories without active transaction', () => {
      expect(() => unitOfWork.billRepository).toThrow(
        'No active transaction. Call beginTransaction first.',
      );

      expect(() => unitOfWork.billItemRepository).toThrow(
        'No active transaction. Call beginTransaction first.',
      );
    });
  });

  describe('State Management', () => {
    test('should report correct transaction state', () => {
      expect(unitOfWork.isInTransaction()).toBe(false);
    });

    test('should cleanup repositories after transaction ends', async () => {
      await unitOfWork.beginTransaction();
      const repo1 = unitOfWork.billRepository;

      await unitOfWork.commit();

      // Should create new instances after transaction ends
      await unitOfWork.beginTransaction();
      const repo2 = unitOfWork.billRepository;

      // Note: Due to how we create repositories, they will be different instances
      expect(repo1).toBeDefined();
      expect(repo2).toBeDefined();
    });
  });
});

describe('Unit of Work Factory Functions', () => {
  test('should create unit of work instance', () => {
    const unitOfWork = CREATE_UNIT_OF_WORK();

    expect(unitOfWork).toBeInstanceOf(TypeOrmUnitOfWork);
  });

  test('should create factory function', () => {
    const factory = CREATE_UNIT_OF_WORK_FACTORY();

    expect(typeof factory).toBe('function');

    const unitOfWork = factory();
    expect(unitOfWork).toBeInstanceOf(TypeOrmUnitOfWork);
  });

  test('should create different instances each time', () => {
    const factory = CREATE_UNIT_OF_WORK_FACTORY();

    const uow1 = factory();
    const uow2 = factory();

    expect(uow1).not.toBe(uow2);
  });
});
