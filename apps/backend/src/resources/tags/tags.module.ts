import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { UserMiddleware } from '../auth/middleware/auth/auth.middleware';

@Module({
  controllers: [TagsController],
  providers: [TagsService, PrismaService, AuthService],
})
export class TagsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('tags/create');
  }
}
