import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from 'src/decorators/public.decorator';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtDto } from './dtos/jwt.dto';
import { CredentialsLoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse({
    description: 'Successfully logged in.',
    type: JwtDto,
  })
  @ApiUnauthorizedResponse({ description: 'Wrong password.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiBody({
    description: 'Login credentials',
    type: CredentialsLoginDto,
  })
  @HttpCode(200)
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<JwtDto> {
    return this.authService.login(req.user);
  }
}
