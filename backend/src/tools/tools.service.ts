import { Injectable } from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { ToolsRepository } from './tools.repository/tools.repository';
import { createReadStream } from 'fs';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import csv = require('csv-parser');

@Injectable()
export class ToolsService {
  constructor(private toolsRepository: ToolsRepository) {}
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

  insertCSV() {
    const tools: { name: string }[] = [];
    createReadStream(
      '/home/robert/Workspaces/Faculdade/TCC/gestao_ferramentas_fermag/backend/events/tools/insercao.csv',
    )
      .pipe(csv())
      .on('data', (data) => tools.push(data))
      .on('end', () => {
        console.log(tools);
        this.toolsRepository.createManyTools(tools);
      });

    return tools;
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
