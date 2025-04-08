import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ToolsModule } from './tools/tools.module';

@Module({
  imports: [ToolsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
