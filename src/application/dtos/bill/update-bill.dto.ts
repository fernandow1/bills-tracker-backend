import { IsNotEmpty, IsOptional } from 'class-validator';
import { UpdateBillItemDTO } from '../bill-item/update-bill-item.dto';
import { Type } from 'class-transformer';

export class UpdateBillDto {
  @IsOptional()
  idShop?: number;
  @IsOptional()
  idCurrency?: number;
  @IsOptional()
  idPaymentMethod?: number;
  @IsOptional()
  idUser?: number;
  @IsOptional()
  total?: number;

  @IsOptional()
  @Type(() => UpdateBillItemDTO)
  @IsNotEmpty({ message: 'billItems should not be empty' })
  billItems?: UpdateBillItemDTO[];
}
