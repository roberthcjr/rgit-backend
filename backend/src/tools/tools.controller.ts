import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ToolsService } from './tools.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { CsvValidationPipe } from './validator/csv.validator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ImportCsvDto } from './dto/import-csv.dto';
import type { Tool_Status } from '@prisma/client';

@ApiBearerAuth()
@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @ApiBody({
    description: 'Tools info to be created',
    type: CreateToolDto,
  })
  @ApiCreatedResponse({
    description: 'Tool created',
  })
  @ApiBadRequestResponse({
    description: 'Wrong tools info',
  })
  @Post()
  create(@Body(ValidationPipe) createToolDto: CreateToolDto) {
    return this.toolsService.create(createToolDto);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of cats',
    type: ImportCsvDto,
  })
  @ApiBadRequestResponse({
    description: 'Wrong type of file or to much size',
  })
  @ApiCreatedResponse({
    description: 'Tools imported',
  })
  @Post('/importCSV')
  @UseInterceptors(FileInterceptor('file'))
  createCSV(@UploadedFile(CsvValidationPipe) file: Express.Multer.File) {
    return this.toolsService.insertCSV(file);
  }

  //TODO: Implements pagination
  @ApiOkResponse({
    description: 'List of tools',
  })
  @Get()
  findAll(@Query('status') status: Tool_Status) {
    return this.toolsService.findAll({
      where: {
        status,
      },
    });
  }

  @ApiOkResponse({
    description: 'Tool requested',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.toolsService.findOne(id);
  }

  @ApiBody({ description: 'Changes tools infos', type: UpdateToolDto })
  @ApiOkResponse({
    description: 'Tool updated',
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateToolDto: UpdateToolDto,
  ) {
    return this.toolsService.update(id, updateToolDto);
  }

  @ApiOkResponse({
    description: 'Tool deleted',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.toolsService.remove(id);
  }
}
