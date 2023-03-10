import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(protected p: PrismaService) {}

  async fetchAll() {
    return await this.p.category.findMany({ select: { id: true, name: true } });
  }
}
