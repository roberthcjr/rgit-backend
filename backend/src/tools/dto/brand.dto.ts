import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class BrandDto {
  @ApiPropertyOptional()
  @IsDefined({ message: 'name field is required when brand is provided.' })
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsDefined({ message: 'id field is required when brand is provided.' })
  @IsUUID()
  id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  waste_rate?: number;
}
