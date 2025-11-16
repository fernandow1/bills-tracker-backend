import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePaymentMethodDTO {
  @IsOptional()
  @IsString({ message: 'Name must be a string.' })
  @MaxLength(150, { message: 'Name must be at most $constraint1 characters long.' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  @MaxLength(255, { message: 'Description must be at most $constraint1 characters long.' })
  description?: string | null;
}
