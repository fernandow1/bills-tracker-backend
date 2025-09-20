import { IsArray, IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { CreateBillItemDTO } from '../bill-item/create-bill-item.dto';
import { Type } from 'class-transformer';

export class CreateBillDto {
  @IsNotEmpty()
  @IsInt({ message: 'The idShop must be an integer number' })
  idShop: number;

  @IsNotEmpty()
  @IsInt({ message: 'The idCurrency must be an integer number' })
  idCurrency: number;

  @IsNotEmpty()
  @IsInt({ message: 'The idPaymentMethod must be an integer number' })
  idPaymentMethod: number;

  @IsNotEmpty()
  @IsInt({ message: 'The idUser must be an integer number' })
  idUser: number;

  @IsNotEmpty()
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
    { message: 'The total must be a valid number' },
  )
  total: number;

  @IsArray({ message: 'billItems must be an array' })
  @Type(() => CreateBillItemDTO)
  @IsNotEmpty({ message: 'billItems should not be empty' })
  billItems: CreateBillItemDTO[];
}
