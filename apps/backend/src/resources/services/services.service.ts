import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { stringToSlug } from 'src/helpers/slug';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreateServiceDTO } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(protected p: PrismaService) {}

  async createService(data: CreateServiceDTO, id: string) {
    const { category, description, features, images, packages, tags, title } =
      data;

    const service = await this.p.service.create({
      data: {
        slug: stringToSlug(title, 10),
        category: {
          connect: {
            id: category,
          },
        },
        title,
        description,
        images,
        tags: {
          connect: tags.map((t) => ({ id: t })),
        },
        user: { connect: { id } },
        package: {
          create: packages.map((p) => ({
            features: {
              create: features.map((f) => ({
                name: f.name,
                includedIn: f.includedIn,
              })),
            },
            ...p,
          })),
        },
      },
      select: {
        slug: true,
      },
    });
    return service;
  }

  async getService(slug: string, username: string) {
    const service = await this.p.service.findFirst({
      where: {
        user: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
        slug: {
          equals: slug,
          mode: 'insensitive',
        },
      },
      select: {
        category: true,
        createdAt: true,
        description: true,

        user: {
          select: {
            username: true,
            profileCompleted: true,
            name: true,
            avatarUrl: true,
            verified: true,
          },
        },
        images: true,
        id: true,
        package: {
          select: {
            deliveryDays: true,
            description: true,
            features: {
              select: {
                id: true,
                name: true,
                includedIn: true,
              },
            },
            id: true,
            name: true,
            price: true,
          },
        },
        slug: true,
        title: true,
        tags: {
          select: {
            name: true,
            slug: true,
            id: true,
          },
        },
      },
    });
    if (!service)
      throw new HttpException('No Service Found.', HttpStatus.NOT_FOUND);
    const totalReviews = await this.p.review.count({
      where: {
        service: {
          id: service.id,
        },
      },
    });
    const totalRating = await this.p
      .$queryRaw`SELECT sum(rating) AS total FROM "public"."Review" WHERE "serviceId" = ${service.id}`;
    return { ...service, totalRating: totalRating[0].total, totalReviews };
  }
  async getServices(username: string, take?: string) {
    const toTake = Number.isNaN(parseInt(take)) ? 10 : parseInt(take);
    const data = await this.p.service.findMany({
      where: {
        user: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
          profileCompleted: true,
          kycCompleted: true,
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
          select: { username: true, avatarUrl: true, name: true },
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

    if (data.length > 10) {
      return {
        services: data,
        next: toTake + 10,
      };
    }
    return {
      services: data,
    };
  }
  async getAllServices(take?: string) {
    const toTake = Number.isNaN(parseInt(take)) ? 10 : parseInt(take);

    const services = await this.p.service.findMany({
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
    return { services };
  }
}
