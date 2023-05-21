import { Module } from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { JobPostController } from './job-post.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { WebhookService } from 'src/services/webhook/webhook.service';

@Module({
  controllers: [JobPostController],
  providers: [JobPostService, PrismaService, AuthService, WebhookService],
})
export class JobPostModule {}
