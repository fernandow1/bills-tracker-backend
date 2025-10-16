import { CreateBillDto } from '@application/dtos/bill/create-bill.dto';
import { UpdateBillDto } from '@application/dtos/bill/update-bill.dto';
import { BillDataSource } from '@domain/datasources/bill.datasource';
import { BillItem } from '@infrastructure/database/entities/bill-item.entity';
import { Bill } from '@infrastructure/database/entities/bill.entity';
import { AppDataSource } from '@infrastructure/database/connection';
import { In, IsNull, Not } from 'typeorm';
import { IQueryFilter } from '@application/models/query-filter.model';
import { Pagination } from '@application/models/pagination.model';

export class BillDataSourceImpl implements BillDataSource {
  async create(bill: CreateBillDto): Promise<Bill> {
    const queryRunner = AppDataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { billItems, ...billData } = bill;

      const newBill = queryRunner.manager.create(Bill, billData);

      const billCreated = await queryRunner.manager.getRepository(Bill).save(newBill);

      if (billCreated && billItems.length) {
        billItems.forEach((item) => (item.idBill = billCreated.id));
      } else {
        throw new Error('Bill was not created');
      }

      queryRunner.manager.getRepository(BillItem).create(billItems);
      await queryRunner.manager.getRepository(BillItem).save(billItems);

      await queryRunner.commitTransaction();
      return billCreated;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async search(filter: IQueryFilter): Promise<Pagination<Bill>> {
    const { page, pageSize, filter: where } = filter;

    const [data, count] = await AppDataSource.getRepository(Bill).findAndCount({
      where,
      relations: {
        billItems: { product: { category: true, brand: true } },
      },
      select: {
        id: true,
        idCurrency: true,
        idShop: true,
        total: true,
        billItems: {
          id: true,
          idBill: true,
          idProduct: true,
          quantity: true,
          netPrice: true,
          netUnit: true,
          product: {
            id: true,
            name: true,
            idBrand: true,
            idCategory: true,
            category: {
              id: true,
              name: true,
            },
            brand: { id: true, name: true },
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data,
      count,
    };
  }

  async findById(id: number): Promise<Bill | null> {
    return await AppDataSource.getRepository(Bill).findOne({ where: { id: Number(id) } });
  }
  async findAll(): Promise<Bill[]> {
    const query = AppDataSource.getRepository(Bill).createQueryBuilder('bill');
    query.leftJoinAndSelect('bill.billItems', 'billItems');
    query.leftJoinAndSelect('billItems.product', 'product');
    query.orderBy('bill.createdAt', 'DESC');
    const bills = await query.getMany();
    return bills;
  }
  async update(id: number, dto: UpdateBillDto): Promise<UpdateBillDto> {
    const queryRunner = AppDataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const existingBill = await queryRunner.manager.findOne(Bill, { where: { id } });
      if (!existingBill) throw new Error('Bill not found');

      const { billItems, ...bill } = dto;

      const updatedBill = queryRunner.manager.merge(Bill, existingBill, bill);
      const savedBill = await queryRunner.manager.save(updatedBill);

      if (billItems && billItems.length) {
        const billItemsUpdated = await queryRunner.manager
          .getRepository(BillItem)
          .upsert(billItems, {
            conflictPaths: ['idBill', 'idProduct'],
            skipUpdateIfNoValuesChanged: true,
          });

        const billItemsDeleted = await queryRunner.manager.getRepository(BillItem).softDelete({
          idBill: id,
          deletedAt: IsNull(),
          id: Not(In(billItems.map((item) => item.id))),
        });

        if (!billItemsUpdated || !billItemsDeleted) throw new Error('BillItems update failed');
      }

      await queryRunner.commitTransaction();
      return savedBill;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async delete(id: number): Promise<void> {
    const queryRunner = AppDataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await queryRunner.manager.getRepository(Bill).findOneOrFail({ where: { id } });

      await queryRunner.manager.getRepository(Bill).softDelete(id);

      await queryRunner.manager.getRepository(BillItem).softDelete({ idBill: id });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
