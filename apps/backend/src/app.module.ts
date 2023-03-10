import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma/prisma.service';
import { AuthModule } from './resources/auth/auth.module';
import { ProfileModule } from './resources/profile/profile.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UploadModule } from './resources/upload/upload.module';
import { StaticModule } from './resources/static/static.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
  imports: [
    ThrottlerModule.forRoot({
      limit: 100,
      ttl: 60,
    }),
    AuthModule,
    ProfileModule,
    UploadModule,
    StaticModule,
    CategoriesModule,
  ],
  exports: [PrismaService],
})
export class AppModule {}
