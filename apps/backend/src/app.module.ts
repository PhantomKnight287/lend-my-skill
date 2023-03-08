import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './resources/profile/profile.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  controllers: [AppController],
  providers: [AppService, PrismaService],
  imports: [
    AuthModule,
    ProfileModule,
    ThrottlerModule.forRoot({
      limit: 100,
      ttl: 60,
    }),
  ],
  exports: [PrismaService],
})
export class AppModule {}
