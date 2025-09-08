import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AuthUserDTO {
  @IsNotEmpty({ message: 'Username must not be empty' })
  @IsString({ message: 'Username must be a string' })
  @MaxLength(100, { message: 'Username must be at most $constraint1 characters long' })
  username: string;

  @IsNotEmpty({ message: 'Password must not be empty' })
  @IsString({ message: 'Password must be a string' })
  @MaxLength(255, { message: 'Password must be at most $constraint1 characters long' })
  password: string;
}
