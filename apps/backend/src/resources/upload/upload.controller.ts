import {
  Body,
  Controller,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { BodyWithUser } from 'src/types/body';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (_, file, cb) =>
          cb(null, `${Date.now()}-${randomUUID()}-${file.originalname}`),
      }),
    }),
  )
  async uploadFile(
    @Body() { user: { id } }: BodyWithUser<unknown>,
    @UploadedFile() file: Express.Multer.File,
    @Query('to') to?: string,
  ) {
    return await this.uploadService.uploadFile(file, id, to);
  }

  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('files', undefined, {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (_, file, cb) =>
          cb(null, `${Date.now()}-${randomUUID()}-${file.originalname}`),
      }),
    }),
  )
  async uploadMultipleFiles(
    @Body() { user: { id } }: BodyWithUser<unknown>,
    @UploadedFiles() files: Express.Multer.File[],
    @Query('to') to?: string,
  ) {
    return await this.uploadService.uploadMultipleFiles(files, id, to);
  }
}
