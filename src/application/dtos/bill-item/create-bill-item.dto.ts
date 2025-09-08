import { NetUnits } from '@domain/value-objects/net-units.enum';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBillItemDTO {
  @IsNotEmpty({ message: 'idBill should not be empty' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'idBill must be a number' },
  )
  idBill: number;

  @IsNotEmpty({ message: 'idProduct should not be empty' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'idProduct must be a number' },
  )
  idProduct: number;

  @IsNotEmpty({ message: 'quantity should not be empty' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'quantity must be a number' },
  )
  quantity: number;

  @IsNotEmpty({ message: 'netPrice should not be empty' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
    { message: 'netPrice must be a number' },
  )
  netPrice: number;

  @IsNotEmpty({ message: 'netUnit should not be empty' })
  @IsEnum(NetUnits, {
    message: `netUnit must be a valid enum value: ${Object.values(NetUnits).join(', ')}`,
  })
  netUnit: NetUnits;
}
