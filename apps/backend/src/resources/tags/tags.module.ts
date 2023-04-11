import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [TagsController],
  providers: [TagsService, PrismaService, AuthService],
})
export class TagsModule {}
