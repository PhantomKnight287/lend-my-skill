import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

enum SearchType {
  Job,
  Service,
}

@Injectable()
export class SearchService {
  constructor(protected p: PrismaService) {}

  async search(
    query: string,
    sType: keyof typeof SearchType = 'Service',
    take?: string,
  ) {
    const toTake = Number.isNaN(parseInt(take)) ? 10 : parseInt(take);
    if (sType === 'Job') {
      const jobs = await this.p.jobPost.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
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
      });
      if (jobs.length === 10) {
        return {
          jobs,
          next: toTake + 10,
        };
      }
      return { jobs };
    }
    const services = await this.p.service.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
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

        tags: {
          select: {
            name: true,
            id: true,
            slug: true,
          },
        },

        images: true,
      },
      take: toTake,
      skip: toTake > 10 ? toTake - 10 : undefined,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
    if (services.length === 10) {
      return {
        services,
        next: toTake + 10,
      };
    }
    return {
      services,
    };
  }
  async searchByCategory(
    category: string,
    query: string,
    sType: 'Job' | 'Service',
    take?: string,
  ) {
    const toTake = Number.isNaN(parseInt(take)) ? 10 : parseInt(take);
    if (sType === 'Job') {
      const jobs = await this.p.jobPost.findMany({
        where: {
          AND: [
            {
              category: { slug: category },
            },
            {
              OR: [
                {
                  title: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
                {
                  description: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              ],
            },
          ],
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
      });
      if (jobs.length === 10) {
        return {
          jobs,
          next: toTake + 10,
        };
      }
      return { jobs };
    }
    const services = await this.p.service.findMany({
      where: {
        AND: [
          {
            category: {
              slug: category,
            },
          },
          {
            OR: [
              {
                title: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          },
        ],
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

        tags: {
          select: {
            name: true,
            id: true,
            slug: true,
          },
        },

        images: true,
      },
      take: toTake,
      skip: toTake > 10 ? toTake - 10 : undefined,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
    if (services.length === 10) {
      return {
        services,
        next: toTake + 10,
      };
    }
    return {
      services,
    };
  }
  async searchByTag(
    tag: string,
    query: string,
    sType: 'Job' | 'Service',
    take?: string,
  ) {
    const toTake = Number.isNaN(parseInt(take)) ? 10 : parseInt(take);
    if (sType === 'Job') {
      const jobs = await this.p.jobPost.findMany({
        where: {
          AND: [
            {
              tags: {
                some: {
                  slug: tag,
                },
              },
            },
            {
              OR: [
                {
                  title: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
                {
                  description: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              ],
            },
          ],
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
      });
      if (jobs.length === 10) {
        return {
          jobs,
          next: toTake + 10,
        };
      }
      return { jobs };
    }
    const services = await this.p.service.findMany({
      where: {
        AND: [
          {
            tags: {
              some: {
                slug: tag,
              },
            },
          },
          {
            OR: [
              {
                title: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          },
        ],
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
        tags: {
          select: {
            name: true,
            id: true,
            slug: true,
          },
        },

        images: true,
      },
      take: toTake,
      skip: toTake > 10 ? toTake - 10 : undefined,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
    if (services.length === 10) {
      return {
        services,
        next: toTake + 10,
      };
    }
    return {
      services,
    };
  }
}
