import { IsOptional, IsString, MaxLength, IsNumber, Min, Max } from 'class-validator';

export class UpdateShopDTO {
  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: 'Name must be a string with a maximum length of $constraint1 characters.',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: 'Description must be a string with a maximum length of $constraint1 characters.',
  })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Latitude must be a valid number.' })
  @Min(-90, { message: 'Latitude must be greater than or equal to -90.' })
  @Max(90, { message: 'Latitude must be less than or equal to 90.' })
  latitude?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Longitude must be a valid number.' })
  @Min(-180, { message: 'Longitude must be greater than or equal to -180.' })
  @Max(180, { message: 'Longitude must be less than or equal to 180.' })
  longitude?: number;
}
