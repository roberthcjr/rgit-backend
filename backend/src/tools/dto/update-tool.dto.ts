import { PartialType } from '@nestjs/mapped-types';
import { CreateToolDto } from './create-tool.dto';
import { Bundle, Tool_Status } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateToolDto extends PartialType(CreateToolDto) {
  @ApiPropertyOptional()
  insertedAt?: Date;
  @ApiPropertyOptional({
    minimum: 0,
  })
  wastage?: number;
  @ApiPropertyOptional({ enum: Tool_Status })
  status?: Tool_Status;
  @ApiPropertyOptional()
  bundle?: Bundle;
}
