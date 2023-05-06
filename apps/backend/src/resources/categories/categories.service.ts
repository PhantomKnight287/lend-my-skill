import { HttpException, Injectable } from '@nestjs/common';
import { stringToSlug } from 'src/helpers/slug';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(protected p: PrismaService) {}

  async fetchAll() {
    return await this.p.category.findMany({
      select: { id: true, name: true, slug: true },
    });
  }

  async create(name: string) {
    await this.p.category.create({
      data: {
        name: name,
        slug: stringToSlug(name, 10),
      },
    });
    return 'Category created successfully';
  }
  async fetchUsingId(id: string, type: 'Job' | 'Service', take?: string) {
    const toTake = Number.isNaN(parseInt(take)) ? 10 : parseInt(take);
    const data = await (type === 'Job'
      ? this.p.jobPost.findMany({
          select: {
            category: {
              select: {
                name: true,
                slug: true,
              },
            },
            id: true,
            slug: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                country: true,
                avatarUrl: true,
                verified: true,
              },
            },
            title: true,
            createdAt: true,
            description: true,

            tags: {
              select: {
                name: true,
                id: true,
                slug: true,
              },
            },
          },
          take: toTake,
          skip: toTake > 10 ? toTake - 10 : undefined,
          orderBy: [
            {
              createdAt: 'desc',
            },
          ],

          where: {
            category: {
              id,
            },
          },
        })
      : this.p.service.findMany({
          where: {
            category: {
              id,
            },
          },
          select: {
            category: {
              select: {
                name: true,
                slug: true,
              },
            },
            id: true,
            slug: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                country: true,
                avatarUrl: true,
                verified: true,
              },
            },
            title: true,
            createdAt: true,
            description: true,
            bannerImage: true,
            package: {
              select: {
                price: true,
              },
              take: 1,
              orderBy: [
                {
                  price: 'asc',
                },
              ],
            },
            rating: true,
            tags: {
              select: {
                name: true,
                id: true,
                slug: true,
              },
            },
            ratedBy: true,
          },
          take: toTake,
          skip: toTake > 10 ? toTake - 10 : undefined,
          orderBy: [
            {
              createdAt: 'desc',
            },
          ],
        }));
    if (data.length === 10) {
      return {
        data,
        next: toTake + 10,
      };
    }
    return { data };
  }
  async getCategoryStats(slug: string) {
    const category = await this.p.category.findFirst({
      where: {
        slug: {
          equals: slug,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        services: {
          select: {
            id: true,
          },
        },
        jobPost: {
          select: {
            _count: true,
          },
        },
      },
    });
    const services = category.services.length;
    delete category.services;
    const jobs = category.jobPost.length;
    delete category.jobPost;
    if (!category) throw new HttpException('No category found', 404);
    return { ...category, services, jobs };
  }
}
