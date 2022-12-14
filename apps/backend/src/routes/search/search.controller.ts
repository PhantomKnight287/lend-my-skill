import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Controller('search')
export class SearchController {
  constructor(protected prisma: PrismaService) {}

  @Get()
  async search(
    @Query() query: { type: 'jobposts' | 'services'; query: string; take: string },
  ) {
    const toTake = Number.isNaN(Number(query.take)) ? 10 : Number(query.take);
    if (query.type !== 'jobposts' && query.type !== 'services')
      throw new HttpException('Invalid type', 400);
    let data;
    const type = query.type;
    if (query.type === 'services') {
      data = await this.prisma.service.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query.query,
              },
            },
            {
              description: {
                contains: query.query,
                mode: 'insensitive',
              },
            },
          ],
          AND: [
            {
              freelancer: {
                kycCompleted: true,
              },
            },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          bannerImage: true,
          freelancer: {
            select: {
              id: true,
              name: true,
              username: true,
              country: true,
              avatarUrl: true,
            },
          },
        },
        take: toTake,
        skip: toTake > 10 ? toTake - 10 : undefined,
      });
      if (data.length === 10) {
        return {
          data,
          next: toTake + 10,
          type,
        };
      }
      return { data, type };
    }
    if (query.type === 'jobposts') {
      data = await this.prisma.jobPost.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query.query,
              },
            },
            {
              description: {
                contains: query.query,
                mode: 'insensitive',
              },
            },
          ],
          AND: [
            {
              author: {
                kycCompleted: true,
              },
            },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          author: {
            select: {
              name: true,
              username: true,
              avatarUrl: true,
              verified: true,
              id: true,
            },
          },
        },
        take: toTake,
        skip: toTake > 10 ? toTake - 10 : undefined,
      });
      if (data.length === 10) {
        return {
          data,
          next: toTake + 10,
          type,
        };
      }
      return { data, type };
    }
  }
  @Get(':id/:type')
  async getRelatedToCategory(
    @Param('id') id: string,
    @Param('type') type: 'services' | 'jobposts',
    @Query('take') take: string,
  ) {
    if (type !== 'services' && type !== 'jobposts')
      throw new HttpException('Invalid type', HttpStatus.BAD_REQUEST);
    const toTake = Number.isNaN(parseInt(take)) ? 10 : parseInt(take);
    const category = await this.prisma.category.findFirst({
      where: {
        id,
      },
    });
    let data;

    if (!category)
      throw new HttpException('No Category found', HttpStatus.NOT_FOUND);
    if (type === 'services') {
      data = await this.prisma.service.findMany({
        where: {
          category: {
            id: category.id,
          },
          freelancer: {
            kycCompleted: true,
          },
        },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          bannerImage: true,
          freelancer: {
            select: {
              id: true,
              name: true,
              username: true,
              country: true,
              avatarUrl: true,
            },
          },
        },

        take: toTake,
        skip: toTake > 10 ? toTake - 10 : undefined,
      });
      if (data.length === 10) {
        return {
          data,
          next: toTake + 10,
          type,
        };
      }
      return { data, type };
    }
    if (type === 'jobposts') {
      data = await this.prisma.jobPost.findMany({
        where: {
          category: {
            id: category.id,
          },
          author: {
            kycCompleted: true,
          },
        },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          author: {
            select: {
              name: true,
              username: true,
              avatarUrl: true,
              verified: true,
              id: true,
            },
          },
        },
        take: toTake,
        skip: toTake > 10 ? toTake - 10 : undefined,
      });
      if (data.length === 10) {
        return {
          data,
          next: toTake + 10,
          type,
        };
      }
      return { data, type };
    }
  }
}
