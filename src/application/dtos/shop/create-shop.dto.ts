import { IsNotEmpty, IsString, MaxLength, IsOptional, IsNumber } from 'class-validator';

export class CreateShopDTO {
  @IsString()
  @MaxLength(255, {
    message: 'Name must be a string with a maximum length of $constraint1 characters.',
  })
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: 'Description must be a string with a maximum length of $constraint1 characters.',
  })
  description?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}
