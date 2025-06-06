import { Injectable } from '@nestjs/common';
import { Prisma, Tool } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ToolsRepository {
  constructor(private prisma: PrismaService) {}

  async tool(
    toolWhereUniqueInput: Prisma.ToolWhereUniqueInput,
  ): Promise<Tool | null> {
    return this.prisma.tool.findUnique({
      where: toolWhereUniqueInput,
    });
  }

  async tools(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ToolWhereUniqueInput;
    where?: Prisma.ToolWhereInput;
    orderBy?: Prisma.ToolOrderByWithRelationInput;
  }): Promise<Tool[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.tool.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: { brand: true, category: true },
    });
  }

  async createTool(data: Prisma.ToolCreateInput): Promise<Tool> {
    return this.prisma.tool.create({
      data,
    });
  }

  async updateTool(params: {
    where: Prisma.ToolWhereUniqueInput;
    data: Prisma.ToolUpdateInput;
  }): Promise<Tool> {
    const { where, data } = params;
    return this.prisma.tool.update({
      data,
      where,
    });
  }

  async deleteTool(where: Prisma.ToolWhereUniqueInput): Promise<Tool> {
    return this.prisma.tool.delete({
      where,
    });
  }

  async createManyTools(data: Prisma.ToolCreateManyInput[]) {
    return this.prisma.tool.createMany({
      data,
    });
  }
}
