import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsString, IsUUID } from 'class-validator';

export class BundleDto {
  @ApiPropertyOptional()
  @IsDefined({ message: 'name field is required when brand is provided.' })
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsDefined({ message: 'id field is required when brand is provided.' })
  @IsUUID()
  id?: string;
}
