/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response, Router } from 'express';
import { BillDataSourceImpl } from '@infrastructure/datasource/bill/bill.datasource.impl';
import { BillRepositoryImpl } from '@infrastructure/repositories/bill/bill.repository.impl';
import { BillController } from '@presentation/bill/controller';
import { validateJwt } from '@infrastructure/http/middlewares/validate-jwt.middleware';

export const BillRouter = {
  routes(): Router {
    const router = Router();

    const billDataSource = new BillDataSourceImpl();
    const billRepository = new BillRepositoryImpl(billDataSource);
    const billController = new BillController(billRepository);

    router.get('/', [validateJwt], (req: Request, res: Response, next: NextFunction) => {
      billController.getAllBills(req, res, next);
    });
    router.get('/search', [validateJwt], (req: Request, res: Response, next: NextFunction) => {
      billController.searchBills(req, res, next);
    });
    router.post('/', [validateJwt], (req: Request, res: Response, next: NextFunction) => {
      billController.createBill(req, res, next);
    });
    router.put('/:id', [validateJwt], (req: Request, res: Response, next: NextFunction) => {
      billController.updateBill(req, res, next);
    });
    router.delete('/:id', [validateJwt], (req: Request, res: Response, next: NextFunction) => {
      billController.deleteBill(req, res, next);
    });
    return router;
  },
};
