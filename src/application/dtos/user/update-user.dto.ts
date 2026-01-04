import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MaxLength(100, { message: 'Name must be at most $constraint1 characters long' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Surname must be a string' })
  @MaxLength(100, { message: 'Surname must be at most $constraint1 characters long' })
  surname?: string | null;

  @IsOptional()
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MaxLength(100, { message: 'Email must be at most $constraint1 characters long' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  @MaxLength(100, { message: 'Username must be at most $constraint1 characters long' })
  username?: string;

  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least $constraint1 characters long' })
  @MaxLength(255, { message: 'Password must be at most $constraint1 characters long' })
  password?: string;
}
