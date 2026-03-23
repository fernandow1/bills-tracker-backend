/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response, Router } from 'express';
import { DataSource } from 'typeorm';
import { BillDataSourceImpl } from '@infrastructure/datasource/bill/bill.datasource.impl';
import { BillRepositoryImpl } from '@infrastructure/repositories/bill/bill.repository.impl';
import { PaymentMethodDataSourceImpl } from '@infrastructure/datasource/payment-method/payment-method.datasource.impl';
import { PaymentMethodRepositoryImpl } from '@infrastructure/repositories/payment-method/payment-method.repository.impl';
import { BillController } from '@presentation/bill/controller';
import { validateJwt } from '@infrastructure/http/middlewares/validate-jwt.middleware';
import { checkAbility } from '@infrastructure/http/middlewares/check-ability.middleware';
import { CREATE_UNIT_OF_WORK_FACTORY } from '@infrastructure/unit-of-work/unit-of-work.factory';
import { ExtractBillDataFromImage } from '@application/uses-cases/bill/extract-bill-data-from-image';
import { GeminiVisionService } from '@infrastructure/services/gemini-vision.service';
import { ShopDataSourceImpl } from '@infrastructure/datasource/shop/shop.datasource.impl';
import { ShopRepositoryImpl } from '@infrastructure/repositories/shop/shop.repository.impl';
import { ProductDataSourceImpl } from '@infrastructure/datasource/product/product.datasource.impl';
import { ProductRepositoryImpl } from '@infrastructure/repositories/product/product.repository.impl';
import { ProductAliasDataSourceImpl } from '@infrastructure/datasource/product-alias/product-alias.datasource.impl';
import { ProductAliasRepositoryImpl } from '@infrastructure/repositories/product-alias/product-alias.repository.impl';
import { CategoryDataSourceImpl } from '@infrastructure/datasource/category/category.datasource.impl';
import { CategoryRepositoryImpl } from '@infrastructure/repositories/category/category.repository.impl';
import { BrandDataSourceImpl } from '@infrastructure/datasource/brand/brand.datasource.impl';
import { BrandRepositoryImpl } from '@infrastructure/repositories/brand/brand.repository.impl';
import { MatchOrCreateProductFromAlias } from '@application/uses-cases/product/match-or-create-product-from-alias';
import { memoryFileUploadMiddleware } from '@infrastructure/http/middlewares/file-upload.middleware';

export const BillRouter = {
  routes(dataSource: DataSource): Router {
    const router = Router();

    const billDataSource = new BillDataSourceImpl(dataSource);
    const billRepository = new BillRepositoryImpl(billDataSource);
    const pmDataSource = new PaymentMethodDataSourceImpl(dataSource);
    const pmRepository = new PaymentMethodRepositoryImpl(pmDataSource);

    // New Repositories for Extraction
    const shopDataSource = new ShopDataSourceImpl(dataSource);
    const shopRepository = new ShopRepositoryImpl(shopDataSource);
    const productDataSource = new ProductDataSourceImpl(dataSource);
    const productRepository = new ProductRepositoryImpl(productDataSource);
    const productAliasDataSource = new ProductAliasDataSourceImpl(dataSource);
    const productAliasRepository = new ProductAliasRepositoryImpl(productAliasDataSource);
    const categoryDataSource = new CategoryDataSourceImpl(dataSource);
    const categoryRepository = new CategoryRepositoryImpl(categoryDataSource);
    const brandDataSource = new BrandDataSourceImpl(dataSource);
    const brandRepository = new BrandRepositoryImpl(brandDataSource);

    const unitOfWorkFactory = CREATE_UNIT_OF_WORK_FACTORY();
    const geminiVisionService = new GeminiVisionService();

    // Use Cases for Extraction
    const matchOrCreateProductFromAlias = new MatchOrCreateProductFromAlias(
      productAliasRepository,
      productRepository,
    );

    const extractBillDataFromImageUseCase = new ExtractBillDataFromImage(
      geminiVisionService,
      matchOrCreateProductFromAlias,
      categoryRepository,
      brandRepository,
    );
    const billController = new BillController(
      billRepository,
      pmRepository,
      unitOfWorkFactory,
      extractBillDataFromImageUseCase,
    );

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

    router.post(
      '/extract-image',
      [validateJwt, checkAbility('create', 'Bill'), memoryFileUploadMiddleware.single('image')],
      (req: Request, res: Response, next: NextFunction) => {
        billController.extractFromImage(req, res, next);
      },
    );

    return router;
  },
};
