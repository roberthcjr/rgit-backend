import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: Implements validation
  @ApiBody({
    description: 'Users info to be created',
    type: CreateUserDto,
  })
  @ApiCreatedResponse({
    description: 'User created',
  })
  @ApiBadRequestResponse({
    description: 'Wrong users info',
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  //TODO: Implements pagination
  @ApiOkResponse({
    description: 'List of users',
  })
  @Get()
  findAll(@Query('hasLends') hasLends: boolean) {
    return this.usersService.findAll({ hasLends });
  }

  @ApiOkResponse({
    description: 'User requested',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  //TODO: Implements validation to body
  @ApiBody({ description: 'Changes users infos', type: UpdateUserDto })
  @ApiOkResponse({
    description: 'User updated',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOkResponse({
    description: 'User deleted',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
