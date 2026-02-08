import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Role } from '@domain/enums/role.enum';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name must not be empty' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(100, { message: 'Name must be at most $constraint1 characters long' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Surname must be a string' })
  @MaxLength(100, { message: 'Surname must be at most $constraint1 characters long' })
  surname: string | null;

  @IsNotEmpty({ message: 'Email must not be empty' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MaxLength(100, { message: 'Email must be at most $constraint1 characters long' })
  email: string;

  @IsNotEmpty({ message: 'Username must not be empty' })
  @IsString({ message: 'Username must be a string' })
  @MaxLength(100, { message: 'Username must be at most $constraint1 characters long' })
  username: string;

  @IsNotEmpty({ message: 'Password must not be empty' })
  @IsString({ message: 'Password must be a string' })
  @MaxLength(255, { message: 'Password must be at most $constraint1 characters long' })
  password: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Role must be a valid role (admin, user, guest)' })
  role?: Role;
}
