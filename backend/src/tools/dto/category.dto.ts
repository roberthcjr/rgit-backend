import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsString, IsUUID, ValidateIf } from 'class-validator';

export class CategoryDto {
  @ApiPropertyOptional()
  @IsDefined({ message: 'The name field is required when brand is provided.' })
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsDefined({ message: 'The id field is required when brand is provided.' })
  @IsUUID()
  id?: string;
}
