import { Module, NestModule } from '@nestjs/common';
import { UpiService } from './upi.service';
import { UpiController } from './upi.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { UserMiddleware } from '../auth/middleware/auth/auth.middleware';

@Module({
  controllers: [UpiController],
  providers: [UpiService, PrismaService, AuthService],
})
export class UpiModule implements NestModule {
  configure(consumer: any) {
    consumer.apply(UserMiddleware).forRoutes(UpiController);
  }
}
