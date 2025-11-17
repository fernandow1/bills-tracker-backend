import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateBrandDTO {
  @IsString({ message: 'Name must be a string' })
  @MaxLength(50, { message: 'Name must be at most $constraint1 characters long' })
  @IsOptional()
  name?: string;
}
