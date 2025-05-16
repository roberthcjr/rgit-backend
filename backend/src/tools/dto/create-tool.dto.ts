import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Brand, Category } from '@prisma/client';

export class CreateToolDto {
  @ApiProperty()
  name: string;
  @ApiPropertyOptional()
  category?: Category;
  @ApiPropertyOptional()
  brand?: Brand;
  @ApiPropertyOptional()
  externalId?: string;
}
