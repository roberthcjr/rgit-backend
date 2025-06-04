import { Injectable } from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { ToolsRepository } from './tools.repository';
import { Readable } from 'stream';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import csv = require('csv-parser');
import { randomUUID } from 'crypto';

// TODO: review the logic to create brand and category when it does not exist
@Injectable()
export class ToolsService {
  constructor(private toolsRepository: ToolsRepository) {}
<<<<<<< HEAD
  create(createToolDto: CreateToolDto) {
    const { name, brand, category } = createToolDto;

    return this.toolsRepository.createTool({
      name,
      ...(brand &&
        brand.id &&
        brand.name && {
          brand: {
            connectOrCreate: {
              where: { id: brand.id },
              create: {
                id: brand.id,
                name: brand.name,
                waste_rate: 1,
              },
            },
          },
        }),
      ...(category &&
        category.id &&
        category.name && {
          category: {
            connectOrCreate: {
              where: { id: category.id },
              create: {
                id: category.id,
                name: category.name,
              },
            },
          },
        }),
=======
  create({
    name,
    brand: { id: brandId, name: brandName },
    category: { id: categoryId, name: categoryName },
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
>>>>>>> main
    });
  }

  findAll() {
    return this.toolsRepository.tools({});
  }

  findOne(id: number) {
    return this.toolsRepository.tool({ id });
  }

  update(id: number, updateToolDto: UpdateToolDto) {
    const { name, brand, category, bundle, insertedAt, status, wastage } =
      updateToolDto;

    return this.toolsRepository.updateTool({
      where: { id },
      data: {
        name,
        inserted_at: insertedAt,
        status,
        wastage,
        ...(brand &&
          brand.id &&
          brand.name && {
            brand: {
              connectOrCreate: {
                where: { id: brand.id },
                create: {
                  id: brand.id,
                  name: brand.name,
                  waste_rate: 1,
                },
              },
            },
          }),
        ...(category &&
          category.id &&
          category.name && {
            category: {
              connectOrCreate: {
                where: { id: category.id },
                create: {
                  id: category.id,
                  name: category.name,
                },
              },
            },
          }),
        ...(bundle &&
          bundle.id &&
          bundle.name && {
            bundle: {
              connectOrCreate: {
                where: { id: bundle.id },
                create: {
                  id: bundle.id,
                  name: bundle.name,
                },
              },
            },
          }),
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