import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

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
}
