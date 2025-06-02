import { PartialType } from '@nestjs/mapped-types';
import { CreateToolDto } from './create-tool.dto';
import { Bundle, Tool_Status } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { BundleDto } from './bundle.dto';
import { Type } from 'class-transformer';

export class UpdateToolDto extends PartialType(CreateToolDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  insertedAt?: Date;
  @ApiPropertyOptional({
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  wastage?: number;
  @ApiPropertyOptional({ enum: Tool_Status })
  @IsOptional()
  @IsEnum(Tool_Status, {
    message: `status must be one of the following values: ${Object.values(Tool_Status).join(', ')}`,
  })
  status?: Tool_Status;
  
  @ApiPropertyOptional({ type: () => BundleDto })
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BundleDto)
  bundle?: BundleDto;
}
