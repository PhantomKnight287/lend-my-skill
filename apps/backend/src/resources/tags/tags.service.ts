import { Injectable } from '@nestjs/common';
import { stringToSlug } from 'src/helpers/slug';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(protected p: PrismaService) {}

  async fetchAll() {
    return await this.p.tags.findMany({
      select: { id: true, name: true, slug: true },
    });
  }

  async create(name: string) {
    await this.p.tags.create({
      data: {
        name,
        slug: stringToSlug(name, 10),
      },
    });
    return 'Tag created successfully';
  }
}
