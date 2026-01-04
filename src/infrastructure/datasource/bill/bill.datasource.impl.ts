import { CreateBillDto } from '@application/dtos/bill/create-bill.dto';
import { UpdateBillDto } from '@application/dtos/bill/update-bill.dto';
import { BillDataSource } from '@domain/datasources/bill.datasource';
import { BillItem } from '@infrastructure/database/entities/bill-item.entity';
import { Bill } from '@infrastructure/database/entities/bill.entity';
import { In, IsNull, Not, QueryRunner, DataSource } from 'typeorm';
import { IQueryFilter } from '@application/models/query-filter.model';
import { Pagination } from '@application/models/pagination.model';

export class BillDataSourceImpl implements BillDataSource {
  constructor(private readonly dataSource: DataSource) {}
  async create(bill: CreateBillDto, transaction?: QueryRunner): Promise<Bill> {
    // If transaction is provided, use it; otherwise create a new one
    if (transaction) {
      return this.createWithTransaction(bill, transaction);
    }

    // Original logic for backward compatibility
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const result = await this.createWithTransaction(bill, queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async createWithTransaction(
    bill: CreateBillDto,
    queryRunner: QueryRunner,
  ): Promise<Bill> {
    const { billItems, ...billData } = bill;

    const newBill = queryRunner.manager.create(Bill, billData);
    const billCreated = await queryRunner.manager.getRepository(Bill).save(newBill);

    if (billCreated && billItems.length) {
      billItems.forEach((item) => (item.idBill = billCreated.id));
      queryRunner.manager.getRepository(BillItem).create(billItems);
      await queryRunner.manager.getRepository(BillItem).save(billItems);
    } else if (!billCreated) {
      throw new Error('Bill was not created');
    }

    return billCreated;
  }

  async search(filter: IQueryFilter): Promise<Pagination<Bill>> {
    const { page, pageSize, filter: where } = filter;

    const [data, count] = await this.dataSource.getRepository(Bill).findAndCount({
      where,
      relations: {
        billItems: { product: { category: true, brand: true } },
        currency: true,
        paymentMethod: true,
        shop: true,
      },
      select: {
        id: true,
        idCurrency: true,
        idShop: true,
        total: true,
        createdAt: true,
        currency: {
          id: true,
          name: true,
          symbol: true,
          code: true,
        },
        billItems: {
          id: true,
          idBill: true,
          idProduct: true,
          quantity: true,
          netPrice: true,
          netUnit: true,
          contentValue: true,
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
    return await this.dataSource.getRepository(Bill).findOne({ where: { id: Number(id) } });
  }
  async findAll(): Promise<Bill[]> {
    const query = this.dataSource.getRepository(Bill).createQueryBuilder('bill');
    query.leftJoinAndSelect('bill.billItems', 'billItems');
    query.leftJoinAndSelect('billItems.product', 'product');
    query.orderBy('bill.createdAt', 'DESC');
    const bills = await query.getMany();
    return bills;
  }
  async update(id: number, dto: UpdateBillDto, transaction?: QueryRunner): Promise<UpdateBillDto> {
    // If transaction is provided, use it; otherwise create a new one
    if (transaction) {
      return this.updateWithTransaction(id, dto, transaction);
    }

    // Original logic for backward compatibility
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const result = await this.updateWithTransaction(id, dto, queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async updateWithTransaction(
    id: number,
    dto: UpdateBillDto,
    queryRunner: QueryRunner,
  ): Promise<UpdateBillDto> {
    const existingBill = await queryRunner.manager.findOne(Bill, { where: { id } });
    if (!existingBill) throw new Error('Bill not found');

    const { billItems, ...bill } = dto;

    const updatedBill = queryRunner.manager.merge(Bill, existingBill, bill);
    const savedBill = await queryRunner.manager.save(updatedBill);

    if (billItems && billItems.length) {
      // Automatically assign idBill to each item to avoid requiring it from the frontend
      const billItemsWithIdBill = billItems.map((item) => ({
        ...item,
        idBill: id,
      }));

      const billItemsUpdated = await queryRunner.manager
        .getRepository(BillItem)
        .upsert(billItemsWithIdBill, {
          conflictPaths: ['idBill', 'idProduct'],
          skipUpdateIfNoValuesChanged: true,
        });

      // Soft delete items that are not in the updated list
      // Filter out items without id (new items) to get only existing item ids
      const existingItemIds = billItems
        .filter((item) => item.id !== undefined && item.id !== null)
        .map((item) => item.id);

      // If there are existing items, delete those not in the list
      // If existingItemIds is empty, it means all items are new, so don't delete anything
      if (existingItemIds.length > 0) {
        const billItemsDeleted = await queryRunner.manager.getRepository(BillItem).softDelete({
          idBill: id,
          deletedAt: IsNull(),
          id: Not(In(existingItemIds)),
        });

        if (!billItemsDeleted) throw new Error('BillItems delete failed');
      }

      if (!billItemsUpdated) throw new Error('BillItems update failed');
    }

    return savedBill;
  }
  async delete(id: number, transaction?: QueryRunner): Promise<void> {
    // If transaction is provided, use it; otherwise create a new one
    if (transaction) {
      return this.deleteWithTransaction(id, transaction);
    }

    // Original logic for backward compatibility
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.deleteWithTransaction(id, queryRunner);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async deleteWithTransaction(id: number, queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.getRepository(Bill).findOneOrFail({ where: { id } });
    await queryRunner.manager.getRepository(Bill).softDelete(id);
    await queryRunner.manager.getRepository(BillItem).softDelete({ idBill: id });
  }
}
