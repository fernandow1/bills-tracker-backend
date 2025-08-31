import { NetUnits } from '@domain/value-objects/net-units.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDTO {
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
  @IsNotEmpty({ message: 'Brand ID is required' })
  idBrand: number;

  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
  @IsNotEmpty({ message: 'Category ID is required' })
  idCategory: number;

  @IsNotEmpty({ message: 'Product name is required' })
  @IsString({ message: 'Product name must be a string' })
  @MaxLength(255, { message: 'Product name must be at most $constraint1 characters long' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Product description must be a string' })
  @MaxLength(255, { message: 'Product description must be at most $constraint1 characters long' })
  description: string | null;

  @IsNotEmpty({ message: 'Net price is required' })
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @Min(0, { message: 'Net price must be at least $constraint1' })
  netPrice: number;

  @IsEnum(NetUnits, {
    message: `Net unit must be a valid enum value: ${Object.values(NetUnits).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Net unit is required' })
  netUnit: NetUnits;

  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
  @Min(0, { message: 'Quantity must be at least $constraint1' })
  quantity: number;
}
