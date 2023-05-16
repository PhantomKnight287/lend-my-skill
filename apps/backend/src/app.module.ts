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
import { PackageModule } from './resources/package/package.module';
import { ConversionService } from './services/conversion/conversion.service';
import { PurchaseModule } from './resources/purchase/purchase.module';
import { RazorpayService } from './services/razorpay/razorpay.service';
import { WebhookModule } from './resources/webhook/webhook.module';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    AuthService,
    ConversionService,
    RazorpayService,
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
    PackageModule,
    PurchaseModule,
    WebhookModule,
  ],
  exports: [PrismaService, RazorpayService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .exclude(
        '/v1/auth/(.*)',
        {
          method: RequestMethod.GET,
          path: '/v1/categories/(.*) ',
        },
        {
          method: RequestMethod.GET,
          path: '/v1/job-post/(.*)',
        },
        {
          method: RequestMethod.GET,
          path: '/v1/job-post',
        },
        {
          method: RequestMethod.GET,
          path: '/v1/profile/:username',
        },
        '/v1/search/(.*)',
        '/v1/search',
        '/v1/services/:slug',
        '/v1/services/user/:username',
        {
          path: '/v1/services',
          method: RequestMethod.GET,
        },
        '/v1/static/(.*)',
        '/v1/upload/(.*)',
        '/v1/upi/(.*)',
        '/v1/categories',
        '/v1/tags',
        '/v1',
        '/v1/package/(.*)',
        '/',
        '/v1/webhook/(.*)',
      )
      .forRoutes('*');
  }
}
