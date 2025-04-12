import { Injectable } from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { ToolsRepository } from './tools.repository/tools.repository';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import csv = require('csv-parser');
import { Readable } from 'stream';

@Injectable()
export class ToolsService {
  constructor(private toolsRepository: ToolsRepository) { }
  create(createToolDto: CreateToolDto) {
    const { name, brand, category } = createToolDto;
    return this.toolsRepository.createTool({
      name,
      brand: {
        connect: brand,
      },
      category: {
        connect: category,
      },
    });
  }

  insertCSV(file: Express.Multer.File) {
    const tools: { name: string }[] = [];
    const readableStream = Readable.from(file.buffer);
    return new Promise((resolve, reject) =>
      readableStream
        .on('error', (error) => reject(error))
        .pipe(csv())
        .on('data', (data) => tools.push(data))
        .on('end', async () => {
          resolve(this.toolsRepository.createManyTools(tools));
        }),
    );
  }

  findAll() {
    return `This action returns all tools`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tool`;
  }

  update(id: number, updateToolDto: UpdateToolDto) {
    return `This action updates a #${id} tool`;
  }

  remove(id: number) {
    return `This action removes a #${id} tool`;
  }
}
