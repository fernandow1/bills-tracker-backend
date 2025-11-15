import { IsOptional, IsString, MaxLength } from 'class-validator';
export class UpdateCurrencyDto {
  @IsOptional()
  @IsString({ message: 'Code must be a string' })
  @MaxLength(10, { message: 'Code must be at most $constraint1 characters long' })
  code?: string;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MaxLength(100, { message: 'Name must be at most $constraint1 characters long' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Symbol must be a string' })
  @MaxLength(10, { message: 'Symbol must be at most $constraint1 characters long' })
  symbol?: string;
}
