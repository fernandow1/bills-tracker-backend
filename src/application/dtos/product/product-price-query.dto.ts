import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class ProductPriceQueryDTO {
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxAgeDays?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number;
}
