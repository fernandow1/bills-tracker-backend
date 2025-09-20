/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response, Router } from 'express';
import { BillDataSourceImpl } from '@infrastructure/datasource/bill/bill.datasource.impl';
import { BillRepositoryImpl } from '@infrastructure/repositories/bill/bill.repository.impl';
import { BillController } from '@presentation/bill/controller';

export const BillRouter = {
  routes(): Router {
    const router = Router();

    const billDataSource = new BillDataSourceImpl();
    const billRepository = new BillRepositoryImpl(billDataSource);
    const billController = new BillController(billRepository);

    router.get('/', (req: Request, res: Response, next: NextFunction) => {
      billController.getAllBills(req, res, next);
    });
    router.post('/', (req: Request, res: Response, next: NextFunction) => {
      billController.createBill(req, res, next);
    });
    router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
      billController.updateBill(req, res, next);
    });
    router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
      billController.deleteBill(req, res, next);
    });
    return router;
  },
};
