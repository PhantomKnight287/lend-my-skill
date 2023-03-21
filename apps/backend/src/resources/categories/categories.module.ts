import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { UserMiddleware } from '../auth/middleware/auth/auth.middleware';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService, AuthService],
})
export class CategoriesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('categories/create');
  }
}
