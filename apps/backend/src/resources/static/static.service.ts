import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class StaticService {
  constructor(protected p: PrismaService) {}

  async getStaticProfiles() {
    return await this.p.user.findMany({
      select: {
        username: true,
      },
    });
  }
  async getStaticServices() {
    return await this.p.service.findMany({
      select: {
        slug: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  }
  async getStaticJobPosts() {
    return await this.p.jobPost.findMany({
      select: {
        slug: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  }
  async getStaticCategories() {
    return await this.p.category.findMany({
      select: { slug: true },
    });
  }
}
