import { Injectable } from '@nestjs/common';
import { CreateLendDto } from './dto/create-lend.dto';
import { LendsRepository } from './lends.repository';
import { ToolsRepository } from 'src/tools/tools.repository';

@Injectable()
export class LendsService {
  constructor(
    private lendsRepository: LendsRepository,
    private toolRepository: ToolsRepository,
  ) {}
  async create({ limit_date: limitDate, tool, user }: CreateLendDto) {
    await this.toolRepository.updateTool({
      data: {
        status: 'AVAILABLE',
      },
      where: {
        id: tool.id,
      },
    });
    return this.lendsRepository.createLend({
      limit_date: limitDate,
      user: {
        connect: {
          id: user.id,
        },
      },
      tool: {
        connect: {
          id: tool.id,
        },
      },
    });
  }

  findAll() {
    return this.lendsRepository.lends({});
  }

  async remove(id: string) {
    const { toolId } = await this.lendsRepository.lend({
      id,
    });
    await this.toolRepository.updateTool({
      data: {
        status: 'AVAILABLE',
      },
      where: {
        id: toolId,
      },
    });
    return this.lendsRepository.deleteLend({
      id,
    });
  }
}
