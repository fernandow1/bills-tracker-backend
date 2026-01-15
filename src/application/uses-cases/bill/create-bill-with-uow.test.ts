import { CreateBillWithUoW } from './create-bill-with-uow';
import { CreateBillDto } from '../../dtos/bill/create-bill.dto';
import { IUnitOfWork } from '../../../domain/ports/unit-of-work.interface';
import { BillRepository } from '../../../domain/repository/bill.repository';
import { BillItemRepository } from '../../../domain/repository/bill-item.repository';
import { Bill } from '../../../domain/entities/bill.entity';
import { NetUnits } from '../../../domain/value-objects/net-units.enum';

describe('CreateBillWithUoW Use Case', () => {
  let createBillUseCase: CreateBillWithUoW;
  let mockUnitOfWork: IUnitOfWork;
  let mockBillRepository: BillRepository;
  let mockBillItemRepository: BillItemRepository;
  let mockUnitOfWorkFactory: () => IUnitOfWork;

  beforeEach(() => {
    // Setup mocks
    mockBillRepository = {
      create: jest.fn(),
      search: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as BillRepository;

    mockBillItemRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    } as unknown as BillItemRepository;

    mockUnitOfWork = {
      billRepository: mockBillRepository,
      billItemRepository: mockBillItemRepository,
      beginTransaction: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      release: jest.fn(),
      isInTransaction: jest.fn().mockReturnValue(true),
    };

    mockUnitOfWorkFactory = jest.fn().mockReturnValue(mockUnitOfWork);

    createBillUseCase = new CreateBillWithUoW(mockUnitOfWorkFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful Bill Creation', () => {
    test('should create bill with items successfully', async () => {
      // Arrange
      const billData: CreateBillDto = {
        idShop: 1,
        idCurrency: 1,
        idPaymentMethod: 1,
        idUser: 1,
        subTotal: 150.5,
        discount: 0,
        total: 150.5, // 2 * 75.25 = 150.50
        idUserOwner: 1,
        purchasedAt: '2024-01-01',
        billItems: [
          {
            idBill: 0, // Will be set by use case
            idProduct: 1,
            quantity: 2,
            netPrice: 75.25,
            netUnit: NetUnits.UNIT,
          },
        ],
      };

      const expectedBill: Bill = {
        id: 1,
        idShop: 1,
        idCurrency: 1,
        idPaymentMethod: 1,
        idUser: 1,
        subTotal: 150.5,
        discount: 0,
        total: 150.75,
        idUserOwner: 1,
        purchasedAt: new Date('2024-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Update expectedBill to match corrected total
      expectedBill.total = 150.5;

      (mockBillRepository.create as jest.Mock).mockResolvedValue(expectedBill);
      (mockBillItemRepository.create as jest.Mock).mockResolvedValue({
        id: 1,
        idBill: 1,
        idProduct: 1,
        quantity: 2,
        netPrice: 75.25,
        netUnit: NetUnits.UNIT,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act
      const result = await createBillUseCase.execute(billData);

      // Assert
      expect(mockUnitOfWorkFactory).toHaveBeenCalledTimes(1);
      expect(mockUnitOfWork.beginTransaction).toHaveBeenCalledTimes(1);

      // Should create bill without items initially
      expect(mockBillRepository.create).toHaveBeenCalledWith({
        idShop: 1,
        idCurrency: 1,
        idPaymentMethod: 1,
        idUser: 1,
        subTotal: 150.5,
        discount: 0,
        total: 150.5, // Corrected total
        idUserOwner: 1,
        purchasedAt: '2024-01-01',
        billItems: [],
      });

      // Should create each bill item with correct idBill
      expect(mockBillItemRepository.create).toHaveBeenCalledWith({
        idBill: 1, // Should use the created bill's ID
        idProduct: 1,
        quantity: 2,
        netPrice: 75.25,
        netUnit: NetUnits.UNIT,
      });

      expect(mockUnitOfWork.commit).toHaveBeenCalledTimes(1);
      expect(mockUnitOfWork.rollback).not.toHaveBeenCalled();
      expect(mockUnitOfWork.release).toHaveBeenCalledTimes(1);

      expect(result).toEqual(expectedBill);
    });
  });

  describe('Business Rules Validation', () => {
    test('should reject bill when total does not match items sum', async () => {
      // Arrange
      const billData: CreateBillDto = {
        idShop: 1,
        idCurrency: 1,
        idPaymentMethod: 1,
        idUser: 1,
        subTotal: 100,
        discount: 0,
        total: 100, // Incorrect total
        idUserOwner: 1,
        purchasedAt: '2024-01-01',
        billItems: [
          {
            idBill: 0,
            idProduct: 1,
            quantity: 2,
            netPrice: 75.25, // Real total should be 150.50
            netUnit: NetUnits.UNIT,
          },
        ],
      };

      // Act & Assert
      await expect(createBillUseCase.execute(billData)).rejects.toThrow(
        'Total mismatch: expected 100, calculated 150.5',
      );

      expect(mockUnitOfWork.beginTransaction).toHaveBeenCalledTimes(1);
      expect(mockBillRepository.create).not.toHaveBeenCalled();
      expect(mockUnitOfWork.rollback).toHaveBeenCalledTimes(1);
      expect(mockUnitOfWork.commit).not.toHaveBeenCalled();
      expect(mockUnitOfWork.release).toHaveBeenCalledTimes(1);
    });

    test('should reject bill with duplicate products', async () => {
      // Arrange
      const billData: CreateBillDto = {
        idShop: 1,
        idCurrency: 1,
        idPaymentMethod: 1,
        idUser: 1,
        subTotal: 200,
        discount: 0,
        total: 200,
        idUserOwner: 1,
        purchasedAt: '2024-01-01',
        billItems: [
          {
            idBill: 0,
            idProduct: 1, // Duplicate product
            quantity: 1,
            netPrice: 100,
            netUnit: NetUnits.UNIT,
          },
          {
            idBill: 0,
            idProduct: 1, // Duplicate product
            quantity: 1,
            netPrice: 100,
            netUnit: NetUnits.UNIT,
          },
        ],
      };

      // Act & Assert
      await expect(createBillUseCase.execute(billData)).rejects.toThrow(
        'Duplicate products are not allowed in the same bill',
      );

      expect(mockUnitOfWork.rollback).toHaveBeenCalledTimes(1);
      expect(mockUnitOfWork.commit).not.toHaveBeenCalled();
    });

    test('should allow small floating point differences in total', async () => {
      // Arrange
      const billData: CreateBillDto = {
        idShop: 1,
        idCurrency: 1,
        idPaymentMethod: 1,
        idUser: 1,
        subTotal: 150.75,
        discount: 0,
        total: 150.75, // Small difference within tolerance
        idUserOwner: 1,
        purchasedAt: '2024-01-01',
        billItems: [
          {
            idBill: 0,
            idProduct: 1,
            quantity: 2,
            netPrice: 75.371, // Calculated total: 150.742 (within 0.01 tolerance)
            netUnit: NetUnits.UNIT,
          },
        ],
      };

      const expectedBill: Bill = {
        id: 1,
        idShop: 1,
        idCurrency: 1,
        idPaymentMethod: 1,
        idUser: 1,
        subTotal: 150.75,
        discount: 0,
        total: 150.75,
        idUserOwner: 1,
        purchasedAt: new Date('2024-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockBillRepository.create as jest.Mock).mockResolvedValue(expectedBill);
      (mockBillItemRepository.create as jest.Mock).mockResolvedValue({});

      // Act
      const result = await createBillUseCase.execute(billData);

      // Assert
      expect(result).toEqual(expectedBill);
      expect(mockUnitOfWork.commit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    test('should rollback transaction on bill creation failure', async () => {
      // Arrange
      const billData: CreateBillDto = {
        idShop: 1,
        idCurrency: 1,
        idPaymentMethod: 1,
        idUser: 1,
        subTotal: 100,
        discount: 0,
        total: 100,
        idUserOwner: 1,
        purchasedAt: '2024-01-01',
        billItems: [
          {
            idBill: 0,
            idProduct: 1,
            quantity: 1,
            netPrice: 100,
            netUnit: NetUnits.UNIT,
          },
        ],
      };

      (mockBillRepository.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(createBillUseCase.execute(billData)).rejects.toThrow('Database error');

      expect(mockUnitOfWork.beginTransaction).toHaveBeenCalledTimes(1);
      expect(mockUnitOfWork.rollback).toHaveBeenCalledTimes(1);
      expect(mockUnitOfWork.commit).not.toHaveBeenCalled();
      expect(mockUnitOfWork.release).toHaveBeenCalledTimes(1);
    });

    test('should rollback transaction on bill item creation failure', async () => {
      // Arrange
      const billData: CreateBillDto = {
        idShop: 1,
        idCurrency: 1,
        idPaymentMethod: 1,
        idUser: 1,
        subTotal: 100,
        discount: 0,
        total: 100,
        idUserOwner: 1,
        purchasedAt: '2024-01-01',
        billItems: [
          {
            idBill: 0,
            idProduct: 1,
            quantity: 1,
            netPrice: 100,
            netUnit: NetUnits.UNIT,
          },
        ],
      };

      const expectedBill: Bill = {
        id: 1,
        idShop: 1,
        idCurrency: 1,
        idPaymentMethod: 1,
        idUser: 1,
        subTotal: 100,
        discount: 0,
        total: 100,
        idUserOwner: 1,
        purchasedAt: new Date('2024-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockBillRepository.create as jest.Mock).mockResolvedValue(expectedBill);
      (mockBillItemRepository.create as jest.Mock).mockRejectedValue(
        new Error('Foreign key constraint'),
      );

      // Act & Assert
      await expect(createBillUseCase.execute(billData)).rejects.toThrow('Foreign key constraint');

      expect(mockBillRepository.create).toHaveBeenCalledTimes(1);
      expect(mockBillItemRepository.create).toHaveBeenCalledTimes(1);
      expect(mockUnitOfWork.rollback).toHaveBeenCalledTimes(1);
      expect(mockUnitOfWork.commit).not.toHaveBeenCalled();
    });
  });
});
