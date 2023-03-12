import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { stringToSlug } from 'src/helpers/slug';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreateServiceDTO } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(protected p: PrismaService) {}

  async createService(data: CreateServiceDTO, id: string) {
    const {
      bannerImage,
      category,
      description,
      features,
      images,
      packages,
      tags,
      title,
    } = data;

    const service = await this.p.service.create({
      data: {
        bannerImage,
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
        bannerImage: true,
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
    console.log(service);
    if (!service)
      throw new HttpException('No Service Found.', HttpStatus.NOT_FOUND);
    return service;
  }
}
