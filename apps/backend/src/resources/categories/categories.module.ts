import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService, AuthService],
})
export class CategoriesModule {}
