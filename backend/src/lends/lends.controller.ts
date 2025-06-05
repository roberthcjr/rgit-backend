import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LendsService } from './lends.service';
import { CreateLendDto } from './dto/create-lend.dto';

@Controller('lends')
export class LendsController {
  constructor(private readonly lendsService: LendsService) {}

  @Post()
  create(@Body() createLendDto: CreateLendDto) {
    return this.lendsService.create(createLendDto);
  }

  @Get()
  findAll() {
    return this.lendsService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lendsService.remove(id);
  }
}
