import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateShopDTO {
  @IsString()
  @MaxLength(255, {
    message: 'Name must be a string with a maximum length of $constraint1 characters.',
  })
  @IsNotEmpty()
  name: string;

  @IsString()
  @MaxLength(255, {
    message: 'Description must be a string with a maximum length of $constraint1 characters.',
  })
  @IsNotEmpty()
  description: string;
}
