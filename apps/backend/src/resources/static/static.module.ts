import { Module } from '@nestjs/common';
import { StaticService } from './static.service';
import { StaticController } from './static.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Module({
  controllers: [StaticController],
  providers: [StaticService, PrismaService],
})
export class StaticModule {}
