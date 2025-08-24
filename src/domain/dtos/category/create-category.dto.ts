import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDTO {
  @IsNotEmpty({ message: 'name is required' })
  @IsString({ message: 'name must be a string' })
  @MaxLength(100, { message: 'name must be at most $constraint1 characters long' })
  name: string;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  @MaxLength(255, { message: 'description must be at most $constraint1 characters long' })
  description: string;
}
