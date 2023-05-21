import { Module } from '@nestjs/common';
import { UpiService } from './upi.service';
import { UpiController } from './upi.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { WebhookService } from 'src/services/webhook/webhook.service';

@Module({
  controllers: [UpiController],
  providers: [UpiService, PrismaService, AuthService, WebhookService],
})
export class UpiModule {}
