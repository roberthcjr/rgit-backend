import { Module } from '@nestjs/common';
import { LendsService } from './lends.service';
import { LendsController } from './lends.controller';
import { LendsRepository } from './lends.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ToolsModule } from 'src/tools/tools.module';

@Module({
  imports: [PrismaModule, ToolsModule],
  controllers: [LendsController],
  providers: [LendsRepository, LendsService],
})
export class LendsModule {}
