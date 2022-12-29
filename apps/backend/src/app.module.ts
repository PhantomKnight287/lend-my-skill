import { Module } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController as SellerAuthController } from './routes/auth/freelancer/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { PrismaService } from './services/prisma/prisma.service';
import { GigsController } from './routes/gigs/gigs.controller';
import { GigsService } from './services/gigs/gigs.service';
import { VerificationService } from './services/verification/verification.service';
import { AuthController as BuyerAuthController } from './routes/auth/client/auth.controller';
import { JobpostController } from './routes/jobpost/jobpost.controller';
import { ProfileController as HydrateProfileController } from './routes/profile/profile.controller';
import { HydrateController } from './routes/hydrate/hydrate.controller';
import { UploadController } from './routes/upload/upload.controller';
import { CategoryController } from './routes/category/category.controller';
import { StaticController } from './routes/static/static.controller';
import { ProfileController as ClientProfileController } from './routes/client/profile/profile.controller';
import { EditableController } from './routes/editable/editable.controller';
import { AccountsController } from './routes/accounts/accounts.controller';
import { LoginController } from './routes/login/login.controller';
import { OrderController } from './routes/order/order.controller';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      limit: 100,
      ttl: 60,
    }),
  ],
  controllers: [
    AppController,
    BuyerAuthController,
    GigsController,
    SellerAuthController,
    JobpostController,
    HydrateProfileController,
    HydrateController,
    UploadController,
    CategoryController,
    StaticController,
    ClientProfileController,
    EditableController,
    AccountsController,
    LoginController,
    OrderController,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    AuthService,
    PrismaService,
    GigsService,
    VerificationService,
  ],
})
export class AppModule {}
