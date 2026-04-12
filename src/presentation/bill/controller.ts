import { CreateBillDto } from '@application/dtos/bill/create-bill.dto';
import { CreateBillItemDTO } from '@application/dtos/bill-item/create-bill-item.dto';
import { UpdateBillDto } from '@application/dtos/bill/update-bill.dto';
import { badRequest, conflict, internalError } from '@presentation/helpers/http-error.helper';
import { queryMapper } from '@application/mappers/query-filter.mapper';
import {
  BILL_ALLOWED_FIELDS,
  BILL_ALLOWED_OPERATIONS,
} from '@application/queries/bill/bills-where';
import { CreateBillWithUoW } from '@application/uses-cases/bill/create-bill-with-uow';
import { GetBills } from '@application/uses-cases/bill/get-bills';
import { SearchBill } from '@application/uses-cases/bill/search-bill';
import { UpdateBill } from '@application/uses-cases/bill/update-bill';
import { ExtractBillDataFromImage } from '@application/uses-cases/bill/extract-bill-data-from-image';
import { BillRepository } from '@domain/repository/bill.repository';
import { PaymentMethodRepository } from '@domain/repository/payment-method.repository';
import { IUnitOfWork } from '@domain/ports/unit-of-work.interface';
import { NetUnits } from '@domain/value-objects/net-units.enum';
import { QueryFilterDTO } from '@infrastructure/http/dto/query-filter.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export class BillController {
  constructor(
    private readonly billRepository: BillRepository,
    private readonly paymentMethodRepository: PaymentMethodRepository,
    private readonly unitOfWorkFactory: () => IUnitOfWork,
    private readonly extractBillDataFromImage?: ExtractBillDataFromImage, // Optional para no romper tests anteriores temporalmente
  ) {}

  createBill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToClass(CreateBillDto, req.body);
      const validationErrors = await validate(dto, {
        whitelist: true,
        validationError: { target: false, value: false },
      });

      if (validationErrors.length) {
        return next(badRequest('Validation failed', validationErrors));
      }

      // Use Unit of Work for complex bill creation with items
      const bill = await new CreateBillWithUoW(
        this.unitOfWorkFactory,
        this.paymentMethodRepository,
      ).execute(dto);

      res.status(201).json(bill);
    } catch (error) {
      console.log('Bill creation error:', error);

      // Handle business rule errors with appropriate status codes
      if (error instanceof Error) {
        if (
          error.message.includes('Total mismatch') ||
          error.message.includes('Duplicate products')
        ) {
          return next(badRequest(error.message, []));
        }
      }

      return next(internalError('Internal server error', error));
    }
  };

  getAllBills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bills = await new GetBills(this.billRepository).execute();
      res.status(200).json(bills);
    } catch (error) {
      console.log(error);
      return next(internalError('Internal server error', error));
    }
  };

  searchBills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToClass(QueryFilterDTO, req.query);

      const validationErrors = await validate(dto, {
        whitelist: true,
        validationError: { target: false, value: false },
      });

      if (validationErrors.length) {
        return next(badRequest('Validation failed', validationErrors));
      }

      const bills = await new SearchBill(this.billRepository).execute(
        queryMapper(dto, {
          allowedFields: BILL_ALLOWED_FIELDS,
          allowedOperations: BILL_ALLOWED_OPERATIONS,
        }),
      );

      res.status(200).json(bills);
    } catch (error) {
      console.log(error);
      return next(internalError('Internal server error', error));
    }
  };

  updateBill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const dto = plainToClass(UpdateBillDto, req.body);
      const validationErrors = await validate(dto, {
        whitelist: true,
        validationError: { target: false, value: false },
      });

      if (validationErrors.length) {
        return next(badRequest('Validation failed', validationErrors));
      }
      const bill = await new UpdateBill(this.billRepository, this.paymentMethodRepository).execute(
        Number(id),
        dto,
      );

      res.status(200).json(bill);
    } catch (error) {
      console.log(error);
      return next(internalError('Internal server error', error));
    }
  };

  deleteBill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.billRepository.delete(Number(id));
      res.status(204).send();
    } catch (error) {
      console.log(error);
      return next(internalError('Internal server error', error));
    }
  };

  extractFromImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        return next(badRequest('No image file provided', []));
      }

      const metadataStr = req.body.metadata;
      if (!metadataStr) {
        return next(badRequest('Metadata is required in the form-data request', []));
      }

      type ExtractBillMetadata = Pick<
        CreateBillDto,
        'idShop' | 'idCurrency' | 'uuidPaymentMethod' | 'purchasedAt'
      > & {
        aiInstructions?: string;
      };

      let metadata: ExtractBillMetadata;
      try {
        metadata = JSON.parse(metadataStr);
      } catch (e) {
        return next(badRequest('Metadata must be a valid JSON string', []));
      }

      if (
        !metadata.idShop ||
        !metadata.idCurrency ||
        !metadata.uuidPaymentMethod ||
        !metadata.purchasedAt
      ) {
        return next(
          badRequest(
            'idShop, idCurrency, uuidPaymentMethod, and purchasedAt are required in metadata',
            [],
          ),
        );
      }

      const idUser = (req as any).user?.id;
      if (!idUser) {
        return next(badRequest('User not authenticated properly', []));
      }

      const { buffer, mimetype } = req.file;

      const aiData = await this.extractBillDataFromImage?.execute(
        buffer,
        mimetype,
        metadata.idShop,
        metadata.aiInstructions,
      );
      if (!aiData) {
        return next(
          internalError('Failed to extract data from image', { reason: 'AI returned null data' }),
        );
      }

      if (aiData.receipt_number && aiData.receipt_number.trim() !== '') {
        const existingBill = await this.billRepository.findByReceipt(
          idUser,
          metadata.idShop,
          aiData.receipt_number.trim(),
        );

        if (existingBill) {
          return next(
            conflict(
              `Receipt already exists: A bill with receipt number ${aiData.receipt_number} from this shop has already been processed.`,
              [{ message: 'Receipt already exists', code: 'DUPLICATE_RECEIPT_ERROR' }],
            ),
          );
        }
      }

      const subTotal = aiData.items.reduce((acc, currentItem) => acc + currentItem.net_price, 0);
      const discount = 0;
      const total = subTotal - discount;

      const createBillDto = new CreateBillDto();
      createBillDto.idShop = metadata.idShop;
      createBillDto.idCurrency = metadata.idCurrency;
      createBillDto.uuidPaymentMethod = metadata.uuidPaymentMethod;
      createBillDto.idUser = idUser;
      createBillDto.subTotal = subTotal;
      createBillDto.discount = discount;
      createBillDto.total = total;
      createBillDto.idUserOwner = idUser;
      createBillDto.purchasedAt = metadata.purchasedAt;
      createBillDto.receiptNumber = aiData.receipt_number
        ? aiData.receipt_number.trim()
        : undefined;

      // Collapse identical products to prevent Duplicate errors
      const itemsMap = new Map<number, (typeof aiData.items)[0]>();

      for (const item of aiData.items) {
        if (item.id_product === undefined || item.id_product === null) continue;

        if (itemsMap.has(item.id_product)) {
          const existing = itemsMap.get(item.id_product)!;
          existing.quantity += item.quantity;
          existing.net_price += item.net_price;
          // net_unit and content_value remain the same since it's the same product
        } else {
          itemsMap.set(item.id_product, { ...item }); // Clone to avoid mutation issues
        }
      }

      createBillDto.billItems = Array.from(itemsMap.values()).map((item) => {
        const createBillItem = new CreateBillItemDTO();
        createBillItem.idBill = 0; // Assigned later inside UoW
        createBillItem.idProduct = item.id_product!;
        createBillItem.quantity = item.quantity;

        // Fallback for contentValue if unit requires it but Gemini missed it
        if (item.net_unit === 'u') {
          createBillItem.contentValue = undefined;
        } else if (item.content_value !== null && item.content_value !== undefined) {
          createBillItem.contentValue = item.content_value;
        } else {
          createBillItem.contentValue = 1; // Default content value logic
        }

        // Calculate unit price based on collapsed totals
        createBillItem.netPrice = item.net_price / (item.quantity > 0 ? item.quantity : 1);

        const unitValue = item.net_unit as string;
        if (!Object.values(NetUnits).includes(unitValue as any)) {
          throw new Error(`Invalid netUnit received from AI: ${unitValue}`);
        }
        createBillItem.netUnit = unitValue as NetUnits;

        return createBillItem;
      });

      if (createBillDto.billItems.length === 0) {
        return next(badRequest('No valid items were extracted from the bill', []));
      }

      const bill = await new CreateBillWithUoW(
        this.unitOfWorkFactory,
        this.paymentMethodRepository,
      ).execute(createBillDto);

      res.status(201).json(bill);
    } catch (error) {
      console.error('Image extraction and bill creation error:', error);

      if (error instanceof Error) {
        if (
          error.message.includes('Total mismatch') ||
          error.message.includes('Duplicate products') ||
          error.message.includes('contentValue') ||
          error.message.includes('netUnit')
        ) {
          return next(badRequest(error.message, []));
        }
      }

      return next(internalError('Failed to process image and create bill', error));
    }
  };
}
