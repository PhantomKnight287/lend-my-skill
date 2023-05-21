import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { WebhookService } from 'src/services/webhook/webhook.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, WebhookService],
  exports: [AuthService],
})
export class AuthModule {}
