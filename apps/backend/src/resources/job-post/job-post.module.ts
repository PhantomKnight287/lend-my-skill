import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { JobPostController } from './job-post.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { UserMiddleware } from '../auth/middleware/auth/auth.middleware';

@Module({
  controllers: [JobPostController],
  providers: [JobPostService, PrismaService, AuthService],
})
export class JobPostModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes({
      method: RequestMethod.POST,
      path: 'job-post',
    });
  }
}
