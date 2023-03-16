import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma/prisma.service';
import { AuthModule } from './resources/auth/auth.module';
import { ProfileModule } from './resources/profile/profile.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UploadModule } from './resources/upload/upload.module';
import { StaticModule } from './resources/static/static.module';
import { CategoriesModule } from './resources/categories/categories.module';
import { TagsModule } from './resources/tags/tags.module';
import { ServicesModule } from './resources/services/services.module';
import { AuthService } from './resources/auth/auth.service';
import { UserMiddleware } from './resources/auth/middleware/auth/auth.middleware';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    AuthService,
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
    TagsModule,
    ServicesModule,
  ],
  exports: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .exclude(
        'static/*',
        'categories',
        'tags',
        'services',
        'profile/:username',
        'auth/login',
        'services/:username/:slug',
        "auth/register"
      )
      .forRoutes('*');
  }
}
