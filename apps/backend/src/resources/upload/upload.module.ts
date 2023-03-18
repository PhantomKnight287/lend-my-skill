import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { UserMiddleware } from '../auth/middleware/auth/auth.middleware';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, PrismaService, AuthService],
})
export class UploadModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('upload/(.*)');
  }
}
