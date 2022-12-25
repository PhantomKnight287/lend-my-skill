import {
  BadRequestException,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { readFileSync, unlink } from 'fs';
import { diskStorage } from 'multer';
import { supabase } from 'src/lib/supabase';
import { randomUUID } from 'crypto';
import { Token } from 'src/decorators/token/token.decorator';
import { VerificationService } from 'src/services/verification/verification.service';

@Controller('upload')
export class UploadController {
  constructor(protected verification: VerificationService) {}
  @Post('')
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
    @UploadedFile() file: Express.Multer.File,
    @Token({ serialize: true }) { id },
  ) {
    const { userFound: isValidClient } = await this.verification.verifyBuyer(
      id,
    );
    const { userFound: isValidFreelancer } =
      await this.verification.verifySeller(id);
    if (!isValidClient && !isValidFreelancer) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const fileContent = readFileSync(`${process.cwd()}/${file.path}`);
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`assets/${id}-${randomUUID()}-${file.filename}`, fileContent, {
        contentType: file.mimetype,
      });
    unlink(
      `${process.cwd()}/${file.path}`,
      (err) => err && console.log(`${err.message}`),
    );
    console.log(error);
    if (error) {
      throw new BadRequestException(undefined, error.message);
    }
    console.log(data);
    return {
      path: data.path,
    };
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
    @UploadedFiles() files: Express.Multer.File[],
    @Token({ serialize: true }) { id },
  ) {
    const { userFound: isValidClient } = await this.verification.verifyBuyer(
      id,
    );
    const { userFound: isValidFreelancer } =
      await this.verification.verifySeller(id);
    if (!isValidClient && !isValidFreelancer) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const urls = [];
    for (const file of files) {
      const fileContent = readFileSync(`${process.cwd()}/${file.path}`);

      const { data, error } = await supabase.storage
        .from('images')
        .upload(`assets/${id}-${randomUUID()}-${file.filename}`, fileContent, {
          contentType: file.mimetype,
        });
      unlink(
        `${process.cwd()}/${file.path}`,
        (err) => err && console.log(`${err.message}`),
      );
      if (error) {
        throw new BadRequestException(error.message, error.message);
      }
      urls.push(data.path);
    }
    return {
      paths: urls,
    };
  }
}
