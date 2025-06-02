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
    console.log('Hashed password: ', hashedPasssword);
    const userCreated = await this.usersRepository.createUser({
      name,
      username,
      password: hashedPasssword,
      job,
      section,
      surname,
    });
    const { password: supressedPassword, ...userCreatedResponse } = userCreated;
    return userCreatedResponse;
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
