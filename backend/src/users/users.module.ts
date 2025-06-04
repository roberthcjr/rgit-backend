import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HashModule } from 'src/hash/hash.module';

@Module({
  imports: [PrismaModule, HashModule],
  providers: [UsersRepository, UsersService],
  exports: [UsersRepository],
  controllers: [UsersController],
})
export class UsersModule {}
