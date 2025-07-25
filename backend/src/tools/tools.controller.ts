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
} from '@nestjs/common';
import { ToolsService } from './tools.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { TsvValidationPipe } from './validator/tsv.validator';
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

  // TODO: Implements validation
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
  create(@Body() createToolDto: CreateToolDto) {
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
  @Post('/import')
  @UseInterceptors(FileInterceptor('file'))
  createCSV(@UploadedFile(TsvValidationPipe) file: Express.Multer.File) {
    return this.toolsService.import(file);
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

  //TODO: Implements validation to body
  @ApiBody({ description: 'Changes tools infos', type: UpdateToolDto })
  @ApiOkResponse({
    description: 'Tool updated',
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateToolDto: UpdateToolDto,
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
