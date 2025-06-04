import { PartialType } from '@nestjs/mapped-types';
import { CreateToolDto } from './create-tool.dto';
import { Tool_Status } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
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
  @ValidateIf((o) => o.bundle !== undefined && o.bundle !== null)
  @ValidateNested()
  @Type(() => BundleDto)
  bundle?: BundleDto;
}
