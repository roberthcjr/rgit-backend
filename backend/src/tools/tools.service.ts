import { Injectable } from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { ToolsRepository } from './tools.repository';
import { Readable } from 'stream';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import csv = require('csv-parser');
import { randomUUID } from 'crypto';
import type { Tool_Status } from '@prisma/client';

// TODO: review the logic to create brand and category when it does not exist
@Injectable()
export class ToolsService {
  constructor(private toolsRepository: ToolsRepository) {}
  create({
    name,
    brand: { id: brandId, name: brandName },
    category: { id: categoryId, name: categoryName },
    status,
  }: CreateToolDto) {
    return this.toolsRepository.createTool({
      name,
      brand: {
        connectOrCreate: {
          where: {
            id: brandId ?? randomUUID(),
          },
          create: {
            name: brandName,
            waste_rate: 1,
            id: randomUUID(),
          },
        },
      },
      category: {
        connectOrCreate: {
          where: {
            id: categoryId ?? randomUUID(),
          },
          create: {
            id: randomUUID(),
            name: categoryName,
          },
        },
      },
      status
    });
  }

  findAll(filter?: {
    where: {
      status: Tool_Status;
    };
  }) {
    return this.toolsRepository.tools({
      where: filter.where,
    });
  }

  findOne(id: number) {
    return this.toolsRepository.tool({ id });
  }

  update(id: number, updateToolDto: UpdateToolDto) {
    const { brand, bundle, insertedAt, category, name, status, wastage } =
      updateToolDto;
    return this.toolsRepository.updateTool({
      where: { id },
      data: {
        brand: { connect: brand },
        bundle: { connect: bundle },
        inserted_at: insertedAt,
        category: { connect: category },
        name,
        status,
        wastage,
      },
    });
  }

  remove(id: number) {
    return this.toolsRepository.deleteTool({ id });
  }

  insertCSV(file: Express.Multer.File) {
    const tools: { name: string; externalId?: string }[] = [];
    const readableStream = Readable.from(file.buffer);
    return new Promise((resolve, reject) =>
      readableStream
        .on('error', (error) => reject(error))
        .pipe(csv())
        .on('data', (data) => {
          tools.push(data);
        })
        .on('end', async () => {
          resolve(this.toolsRepository.createManyTools(tools));
        }),
    );
  }
}
