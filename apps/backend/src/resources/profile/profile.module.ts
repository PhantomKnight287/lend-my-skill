import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { UserMiddleware } from '../auth/middleware/auth/auth.middleware';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, PrismaService, AuthService],
})
export class ProfileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .exclude(
        {
          path: 'profile/:username',
          method: RequestMethod.GET,
        },
        {
          path: 'profile/:username',
          method: RequestMethod.OPTIONS,
        },
      )
      .forRoutes(ProfileController);
  }
}
