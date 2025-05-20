import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}
  create({ name, username, password, surname, job, section }: CreateUserDto) {
    return this.usersRepository.createUser({
      name,
      username,
      password,
      job,
      section,
      surname,
    });
  }

  findAll() {
    return this.usersRepository.users({});
  }

  findOne(id: string) {
    return this.usersRepository.user({ id });
  }

  update(
    id: string,
    { name, surname, username, password, job, section }: UpdateUserDto,
  ) {
    return this.usersRepository.updateUser({
      where: { id },
      data: {
        name,
        surname,
        username,
        password,
        job,
        section,
      },
    });
  }

  remove(id: string) {
    return this.usersRepository.deleteUser({ id });
  }
}
