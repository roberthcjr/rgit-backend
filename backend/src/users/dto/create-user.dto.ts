import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiPropertyOptional()
  surname?: string;
  @ApiPropertyOptional()
  job?: string;
  @ApiPropertyOptional()
  section?: string;
}
