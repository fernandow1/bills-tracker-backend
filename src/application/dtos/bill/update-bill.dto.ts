import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { UpdateBillItemDTO } from '../bill-item/update-bill-item.dto';
import { Type } from 'class-transformer';

export class UpdateBillDto {
  @IsOptional()
  idShop?: number;
  @IsOptional()
  idCurrency?: number;
  @IsOptional()
  @IsUUID('7', { message: 'The uuidPaymentMethod must be a valid UUID v7' })
  uuidPaymentMethod?: string;
  @IsOptional()
  idUser?: number;
  @IsOptional()
  subTotal?: number;
  @IsOptional()
  discount?: number;
  @IsOptional()
  total?: number;
  @IsOptional()
  idUserOwner?: number;
  @IsOptional()
  purchasedAt?: Date;

  @IsOptional()
  @Type(() => UpdateBillItemDTO)
  @IsNotEmpty({ message: 'billItems should not be empty' })
  billItems?: UpdateBillItemDTO[];
}
