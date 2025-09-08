import { IsNumber, IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class UpdateProductDTO {
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
  @IsNotEmpty({ message: 'Brand ID is required' })
  @IsOptional()
  idBrand: number;

  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
  @IsNotEmpty({ message: 'Category ID is required' })
  @IsOptional()
  idCategory: number;

  @IsNotEmpty({ message: 'Product name is required' })
  @IsString({ message: 'Product name must be a string' })
  @MaxLength(255, { message: 'Product name must be at most $constraint1 characters long' })
  @IsOptional()
  name: string;

  @IsString({ message: 'Product description must be a string' })
  @MaxLength(255, { message: 'Product description must be at most $constraint1 characters long' })
  @IsOptional()
  description: string | null;
}
