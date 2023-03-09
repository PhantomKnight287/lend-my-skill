import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { Token } from 'decorator/token/token.decorator';
import { diskStorage } from 'multer';
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
    @Token({ serialize: true }) { id },
    @UploadedFile() file: Express.Multer.File,
    @Query('to') to?: string,
  ) {
    return await this.uploadService.uploadFile(file, id, to);
  }
}
