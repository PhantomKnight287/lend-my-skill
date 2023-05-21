import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { WebhookService } from 'src/services/webhook/webhook.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, PrismaService, AuthService, WebhookService],
})
export class ProfileModule {}
