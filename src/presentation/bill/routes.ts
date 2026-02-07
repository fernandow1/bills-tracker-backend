/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response, Router } from 'express';
import { DataSource } from 'typeorm';
import { BillDataSourceImpl } from '@infrastructure/datasource/bill/bill.datasource.impl';
import { BillRepositoryImpl } from '@infrastructure/repositories/bill/bill.repository.impl';
import { BillController } from '@presentation/bill/controller';
import { validateJwt } from '@infrastructure/http/middlewares/validate-jwt.middleware';
import { checkAbility } from '@infrastructure/http/middlewares/check-ability.middleware';
import { CREATE_UNIT_OF_WORK_FACTORY } from '@infrastructure/unit-of-work/unit-of-work.factory';

export const BillRouter = {
  routes(dataSource: DataSource): Router {
    const router = Router();

    const billDataSource = new BillDataSourceImpl(dataSource);
    const billRepository = new BillRepositoryImpl(billDataSource);
    const unitOfWorkFactory = CREATE_UNIT_OF_WORK_FACTORY();
    const billController = new BillController(billRepository, unitOfWorkFactory);

    router.get(
      '/',
      [validateJwt, checkAbility('read', 'Bill')],
      (req: Request, res: Response, next: NextFunction) => {
        billController.getAllBills(req, res, next);
      },
    );
    router.get(
      '/search',
      [validateJwt, checkAbility('read', 'Bill')],
      (req: Request, res: Response, next: NextFunction) => {
        billController.searchBills(req, res, next);
      },
    );
    router.post(
      '/',
      [validateJwt, checkAbility('create', 'Bill')],
      (req: Request, res: Response, next: NextFunction) => {
        billController.createBill(req, res, next);
      },
    );
    router.put(
      '/:id',
      [validateJwt, checkAbility('update', 'Bill')],
      (req: Request, res: Response, next: NextFunction) => {
        billController.updateBill(req, res, next);
      },
    );
    router.delete(
      '/:id',
      [validateJwt, checkAbility('delete', 'Bill')],
      (req: Request, res: Response, next: NextFunction) => {
        billController.deleteBill(req, res, next);
      },
    );
    return router;
  },
};
