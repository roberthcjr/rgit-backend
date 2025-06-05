import { Injectable } from '@nestjs/common';
import { Prisma, Lend } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LendsRepository {
  constructor(private prisma: PrismaService) {}

  async lend(
    lendWhereUniqueInput: Prisma.LendWhereUniqueInput,
  ): Promise<Lend | null> {
    return this.prisma.lend.findUnique({
      where: lendWhereUniqueInput,
    });
  }

  async lends(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.LendWhereUniqueInput;
    where?: Prisma.LendWhereInput;
    orderBy?: Prisma.LendOrderByWithRelationInput;
  }): Promise<Lend[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.lend.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createLend(data: Prisma.LendCreateInput): Promise<Lend> {
    return this.prisma.lend.create({
      data,
    });
  }

  async updateLend(params: {
    where: Prisma.LendWhereUniqueInput;
    data: Prisma.LendUpdateInput;
  }): Promise<Lend> {
    const { where, data } = params;
    return this.prisma.lend.update({
      data,
      where,
    });
  }

  async deleteLend(where: Prisma.LendWhereUniqueInput): Promise<Lend> {
    return this.prisma.lend.delete({
      where,
    });
  }

  async createManyLends(data: Prisma.LendCreateManyInput[]) {
    return this.prisma.lend.createMany({
      data,
    });
  }
}
