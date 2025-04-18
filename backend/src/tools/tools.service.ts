import { Injectable } from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { ToolsRepository } from './tools.repository/tools.repository';
import csvParser from 'csv-parser';

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

  findAll() {
    return this.toolsRepository.tools({});
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
    const tools: { name: string }[] = [];
    return new Promise((resolve, reject) =>
      file.stream
        .on('error', (error) => reject(error))
        .pipe(csvParser())
        .on('data', (data) => tools.push(data))
        .on('end', async () => {
          resolve(this.toolsRepository.createManyTools(tools));
        }),
    );
  }
}
