import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { readFileSync, unlink } from 'fs';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { client } from 'src/utils/supabase';

@Injectable()
export class UploadService {
  constructor(protected p: PrismaService) {}

  async uploadFile(file: Express.Multer.File, id: string, folderName?: string) {
    const fileContents = readFileSync(`${process.cwd()}/${file.path}`);
    const { data, error } = await client.storage
      .from('images')
      .upload(
        `${folderName || 'images'}/${id}-${randomUUID()}-${file.filename}`,
        fileContents,
        {
          contentType: file.mimetype,
        },
      );
    unlink(
      `${process.cwd()}/${file.path}`,
      (err) => err && console.log(`${err.message}`),
    );
    if (error) {
      throw new BadRequestException(undefined, error.message);
    }
    await this.p.uploads.create({
      data: {
        type: file.mimetype,
        url: data.path,
        user: {
          connect: {
            id,
          },
        },
      },
    });
    return {
      path: data.path,
    };
  }
  async uploadMultipleFiles(
    files: Express.Multer.File[],
    id: string,
    folderName?: string,
  ) {
    const urls = [];
    for (const file of files) {
      const fileContent = readFileSync(`${process.cwd()}/${file.path}`);

      const { data, error } = await client.storage
        .from('images')
        .upload(
          `${folderName || 'assets'}/${id}-${randomUUID()}-${file.filename}`,
          fileContent,
          {
            contentType: file.mimetype,
          },
        );
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
