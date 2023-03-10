import { Injectable } from '@nestjs/common';
import { stringToSlug } from 'src/helpers/slug';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(protected p: PrismaService) {}

  async fetchAll() {
    return await this.p.category.findMany({ select: { id: true, name: true } });
  }

  async create(name: string) {
    await this.p.category.create({
      data: {
        name: name,
        slug: stringToSlug(name),
      },
    });
    return 'Category created successfully';
  }
}
