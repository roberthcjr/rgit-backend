import { PartialType } from '@nestjs/mapped-types';
import { CreateToolDto } from './create-tool.dto';
import { Bundle, Tool_Status } from '@prisma/client';

export class UpdateToolDto extends PartialType(CreateToolDto) {
  insertedAt?: Date;
  wastage?: number;
  status?: Tool_Status;
  bundle?: Bundle;
}
