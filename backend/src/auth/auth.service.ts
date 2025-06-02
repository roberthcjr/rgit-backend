import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersRepository } from 'src/users/users.repository';
import { JwtDto } from './dtos/jwt.dto';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private hashService: HashService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const usersFound: User[] = await this.usersRepository.users({
      where: { username },
    });
    const user = usersFound[0];

    if (!user) throw new NotFoundException();

    const isCorrectPassword = await this.hashService.compare(
      pass,
      user.password,
    );

    if (!isCorrectPassword) throw new UnauthorizedException();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async login(user: any): Promise<JwtDto> {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
