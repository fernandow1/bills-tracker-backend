import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBrandDTO {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
}
