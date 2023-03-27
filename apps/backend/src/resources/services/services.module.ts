import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { UserMiddleware } from '../auth/middleware/auth/auth.middleware';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService, PrismaService, AuthService],
})
export class ServicesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .exclude('services/:slug', 'services/user/:username', {
        path: 'services',
        method: RequestMethod.GET,
      })
      .forRoutes('services');
  }
}
