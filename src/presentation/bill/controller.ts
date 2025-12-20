import { CreateBillDto } from '@application/dtos/bill/create-bill.dto';
import { UpdateBillDto } from '@application/dtos/bill/update-bill.dto';
import { AppError } from '@application/errors/app-error';
import { queryMapper } from '@application/mappers/query-filter.mapper';
import {
  BILL_ALLOWED_FIELDS,
  BILL_ALLOWED_OPERATIONS,
} from '@application/queries/bill/bills-where';
import { CreateBillWithUoW } from '@application/uses-cases/bill/create-bill-with-uow';
import { GetBills } from '@application/uses-cases/bill/get-bills';
import { SearchBill } from '@application/uses-cases/bill/search-bill';
import { UpdateBill } from '@application/uses-cases/bill/update-bill';
import { BillRepository } from '@domain/repository/bill.repository';
import { IUnitOfWork } from '@domain/ports/unit-of-work.interface';
import { QueryFilterDTO } from '@infrastructure/http/dto/query-filter.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export class BillController {
  constructor(
    private readonly billRepository: BillRepository,
    private readonly unitOfWorkFactory: () => IUnitOfWork,
  ) {}

  createBill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToClass(CreateBillDto, req.body);
      const validationErrors = await validate(dto, {
        whitelist: true,
        validationError: { target: false, value: false },
      });

      if (validationErrors.length) {
        return next(AppError.badRequest('Validation failed', validationErrors));
      }

      // Use Unit of Work for complex bill creation with items
      const bill = await new CreateBillWithUoW(this.unitOfWorkFactory).execute(dto);

      res.status(201).json(bill);
    } catch (error) {
      console.log('Bill creation error:', error);

      // Handle business rule errors with appropriate status codes
      if (error instanceof Error) {
        if (
          error.message.includes('Total mismatch') ||
          error.message.includes('Duplicate products')
        ) {
          return next(AppError.badRequest(error.message, []));
        }
      }

      return next(AppError.internalError('Internal server error'));
    }
  };

  getAllBills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bills = await new GetBills(this.billRepository).execute();
      res.status(200).json(bills);
    } catch (error) {
      console.log(error);
      return next(AppError.internalError('Internal server error'));
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
        return next(AppError.badRequest('Validation failed', validationErrors));
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
      return next(AppError.internalError('Internal server error'));
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
        return next(AppError.badRequest('Validation failed', validationErrors));
      }
      const bill = await new UpdateBill(this.billRepository).execute(Number(id), dto);

      res.status(200).json(bill);
    } catch (error) {
      console.log(error);
      return next(AppError.internalError('Internal server error'));
    }
  };

  deleteBill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.billRepository.delete(Number(id));
      res.status(204).send();
    } catch (error) {
      console.log(error);
      return next(AppError.internalError('Internal server error'));
    }
  };
}
