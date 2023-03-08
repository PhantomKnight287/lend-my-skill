import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaService } from './services/prisma/prisma.service';

@Module({
  controllers: [AppController],
  providers: [AppService, PrismaService],
  imports: [AuthModule],
})
export class AppModule {}
