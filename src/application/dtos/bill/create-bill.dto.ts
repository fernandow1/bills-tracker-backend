import { IsArray, IsDateString, IsInt, IsNotEmpty, IsNumber } from 'class-validator';
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
    { message: 'The subTotal must be a valid number' },
  )
  subTotal: number;

  @IsNotEmpty()
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
    { message: 'The discount must be a valid number' },
  )
  discount: number;

  @IsNotEmpty()
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
    { message: 'The total must be a valid number' },
  )
  total: number;

  @IsNotEmpty()
  @IsInt({ message: 'The idUserOwner must be an integer number' })
  idUserOwner: number;

  @IsNotEmpty()
  @IsDateString(
    {},
    {
      message: 'The purchasedAt must be a valid ISO 8601 date (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)',
    },
  )
  purchasedAt: string;

  @IsArray({ message: 'billItems must be an array' })
  @Type(() => CreateBillItemDTO)
  @IsNotEmpty({ message: 'billItems should not be empty' })
  billItems: CreateBillItemDTO[];
}
