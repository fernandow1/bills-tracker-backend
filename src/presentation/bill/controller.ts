import { CreateBillDto } from '@application/dtos/bill/create-bill.dto';
import { UpdateBillDto } from '@application/dtos/bill/update-bill.dto';
import { AppError } from '@application/errors/app-error';
import { CreateBill } from '@application/uses-cases/bill/create-bill';
import { GetBills } from '@application/uses-cases/bill/get-bills';
import { UpdateBill } from '@application/uses-cases/bill/update-bill';
import { BillRepository } from '@domain/repository/bill.repository';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export class BillController {
  constructor(private readonly billRepository: BillRepository) {}

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

      const bill = await new CreateBill(this.billRepository).execute(dto);

      res.status(201).json(bill);
    } catch (error) {
      console.log(error);
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
