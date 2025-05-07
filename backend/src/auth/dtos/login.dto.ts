import { ApiProperty } from '@nestjs/swagger';

export class CredentialsLoginDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}
