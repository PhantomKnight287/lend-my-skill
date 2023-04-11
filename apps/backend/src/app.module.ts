import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
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
import { UpiModule } from './resources/upi/upi.module';
import { JobPostModule } from './resources/job-post/job-post.module';
import { SearchModule } from './resources/search/search.module';

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
    UpiModule,
    JobPostModule,
    SearchModule,
  ],
  exports: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .exclude(
        'auth/(.*)',
        {
          method: RequestMethod.GET,
          path: 'categories/(.*) ',
        },
        {
          method: RequestMethod.GET,
          path: 'job-post/(.*)',
        },
        {
          method: RequestMethod.GET,
          path: 'profile/:username',
        },
        'search/(.*)',
        'services/:slug',
        'services/user/:username',
        {
          path: 'services',
          method: RequestMethod.GET,
        },
        'static/(.*)',
        'upload/(.*)',
        'upi/(.*)',
      )
      .forRoutes('*');
  }
}
