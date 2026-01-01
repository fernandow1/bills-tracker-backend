import { NetUnits } from '@domain/value-objects/net-units.enum';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateBillItemDTO {
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'id must be a number' },
  )
  @IsNotEmpty({ message: 'id is required' })
  id: number;

  @IsOptional()
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'idBill must be a number' },
  )
  idBill?: number;

  @IsOptional()
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'idProduct must be a number' },
  )
  idProduct?: number;

  @IsOptional()
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'quantity must be a number' },
  )
  quantity?: number;

  @IsOptional()
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 3 },
    { message: 'contentValue must be a number' },
  )
  contentValue?: number;

  @IsOptional()
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
    { message: 'netPrice must be a number' },
  )
  netPrice?: number;

  @IsOptional()
  @IsEnum(String, {
    message: `netUnit must be a valid enum value`,
  })
  netUnit?: NetUnits;
}
