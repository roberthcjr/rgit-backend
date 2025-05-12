import { PartialType } from '@nestjs/mapped-types';
import { CreateToolDto } from './create-tool.dto';
import { Bundle, Tool_Status } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';

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
  @ApiPropertyOptional()
  @IsOptional()
  bundle?: Bundle;
}
