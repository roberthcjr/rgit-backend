import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private hashService: HashService,
  ) {}
  async create({
    name,
    username,
    password,
    surname,
    job,
    section,
  }: CreateUserDto) {
    const hashedPasssword = await this.hashService.hash(password);
    const userCreated = await this.usersRepository.createUser({
      name,
      username,
      password: hashedPasssword,
      job,
      section,
      surname,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userCreatedResponse } = userCreated;
    return userCreatedResponse;
  }

  findAll({ hasLends }: { hasLends: boolean }) {
    let filters = {};
    if (!hasLends) {
      filters = {
        Lend: {
          none: {},
        },
      };
    }
    return this.usersRepository.users({
      where: {
        ...filters,
      },
    });
  }

  findOne(id: string) {
    return this.usersRepository.user({ id });
  }

  async update(
    id: string,
    { name, surname, username, password, job, section }: UpdateUserDto,
  ) {
    const hashedPassword = await this.hashService.hash(password);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...updatedUser } =
      await this.usersRepository.updateUser({
        where: { id },
        data: {
          name,
          surname,
          username,
          password: hashedPassword,
          job,
          section,
        },
      });
    return updatedUser;
  }

  remove(id: string) {
    return this.usersRepository.deleteUser({ id });
  }
}
