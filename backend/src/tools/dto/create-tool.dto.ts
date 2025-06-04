import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { BrandDto } from './brand.dto';
import { Type } from 'class-transformer';
import { CategoryDto } from './category.dto';

export class CreateToolDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ type: () => CategoryDto })
  @ValidateIf((o) => o.category !== undefined && o.category !== null)
  @ValidateNested()
  @Type(() => CategoryDto)
  category?: CategoryDto;

  @ApiPropertyOptional({ type: () => BrandDto })
  @ValidateIf((o) => o.brand !== undefined && o.brand !== null)
  @ValidateNested()
  @Type(() => BrandDto)
  brand?: BrandDto;

  @ApiPropertyOptional()
<<<<<<< HEAD
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  externalId?: string;
}
=======
  category?: Category;
  @ApiPropertyOptional()
  brand?: Brand;
  @ApiPropertyOptional()
  externalId?: string;
}
>>>>>>> main
