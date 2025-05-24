import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Brand, Category, Tool_Status } from '@prisma/client';

export class CreateToolDto {
  @ApiProperty()
  name: string;
  @ApiPropertyOptional()
  category?: Category;
  @ApiPropertyOptional()
  brand?: Brand;
  @ApiPropertyOptional()
  externalId?: string;
  @ApiPropertyOptional({ enum: Tool_Status })
  status?: Tool_Status;
}
