import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Brand, Category } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateToolDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

 /*These properties (category, brand, bundle) should only receive the id and not the entire prisma model, so that in the ToolsService class the connect only receives the id to make the relation
 And so it can be validated as well*/
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  category?: Category;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  brand?: Brand;
}
