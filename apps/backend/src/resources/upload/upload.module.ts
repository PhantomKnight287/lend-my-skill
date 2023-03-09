import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, PrismaService],
})
export class UploadModule {}
