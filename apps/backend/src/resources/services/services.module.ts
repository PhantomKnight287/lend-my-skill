import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { WebhookService } from 'src/services/webhook/webhook.service';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService, PrismaService, AuthService, WebhookService],
})
export class ServicesModule {}
