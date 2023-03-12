import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { UserMiddleware } from '../auth/middleware/auth/auth.middleware';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService, AuthService],
})
export class CategoriesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .exclude({
        method: RequestMethod.GET,
        path: 'categories',
      })
      .forRoutes(CategoriesController);
  }
}
