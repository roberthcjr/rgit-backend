import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsString, IsUUID } from 'class-validator';

export class CategoryDto {
  @ApiPropertyOptional()
  @IsDefined({
    message: 'name field is required when category is provided.',
  })
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsDefined({ message: 'id field is required when category is provided.' })
  @IsUUID()
  id?: string;
}
