import { Module } from '@nestjs/common';
import { ToolsService } from './tools.service';
import { ToolsController } from './tools.controller';
import { ToolsRepository } from './tools.repository/tools.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ToolsController],
  providers: [ToolsService, ToolsRepository, PrismaService],
})
export class ToolsModule {}
