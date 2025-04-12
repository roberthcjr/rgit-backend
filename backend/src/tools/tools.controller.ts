import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ToolsService } from './tools.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypeValidationPipe } from 'src/validators/file-type-validation.pipe';

@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) { }

  @Post()
  create(@Body() createToolDto: CreateToolDto) {
    return this.toolsService.create(createToolDto);
  }

  @Post('importCSV')
  @UseInterceptors(FileInterceptor('file'))
  importCSV(@UploadedFile(FileTypeValidationPipe) file: Express.Multer.File) {
    return this.toolsService.insertCSV(file);
  }

  @Get()
  findAll() {
    return this.toolsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toolsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateToolDto: UpdateToolDto) {
    return this.toolsService.update(+id, updateToolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toolsService.remove(+id);
  }
}
