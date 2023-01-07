import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { Token } from 'src/decorators/token/token.decorator';
import { ServiceService } from 'src/services/service/services.service';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { VerificationService } from 'src/services/verification/verification.service';
import { titleToSlug } from 'src/utils/slug';
import { CreateServiceDto } from 'src/validators/services.validator';

@Controller('services')
export class ServiceController {
  constructor(
    protected prisma: PrismaService,
    protected services: ServiceService,
    protected verify: VerificationService,
  ) {}

  @Get()
  async getServices(@Query('take') take: string) {
    const toOutput = Number.isNaN(Number(take)) ? 10 : Number(take);

    const data = await this.prisma.service.findMany({
      take: toOutput,
      orderBy: [
        {
          createdAt: 'desc',
        },
        {
          updatedAt: 'desc',
        },
      ],
      select: {
        category: true,
        createdAt: true,
        description: true,
        bannerImage: true,
        id: true,
        title: true,
        tags: true,
        slug: true,
        freelancer: {
          select: {
            username: true,
            name: true,
            country: true,
            avatarUrl: true,
            id: true,
          },
        },
      },
      where: {
        freelancer: {
          kycCompleted: true,
        },
      },
      skip: toOutput > 10 ? toOutput - 10 : undefined,
    });
    if (toOutput > 10) {
      return {
        services: data,
        next: toOutput + 10,
      };
    }
    return {
      services: data,
    };
  }
  @Post('create')
  async createService(
    @Body() body: CreateServiceDto,
    @Token({ serialize: true }) { id },
  ) {
    const {
      bannerImage,
      category,
      description,
      images,
      tags,
      title,
      features,
      packages,
      questions,
    } = body;
    const { userFound } = await this.verify.verifySeller(id);
    if (!userFound)
      throw new HttpException(
        'No user account found with associated authentication token.',
        HttpStatus.NOT_FOUND,
      );

    const isCategoryValid = await this.verify.verifySeller(category);
    if (!isCategoryValid)
      throw new HttpException('Invalid category.', HttpStatus.BAD_REQUEST);

    const service = await this.prisma.service.create({
      data: {
        bannerImage,
        description,
        images,
        tags,
        title,
        slug: `${titleToSlug(title)}-${nanoid(10)}`,
        category: {
          connect: {
            id: category,
          },
        },
        freelancer: {
          connect: {
            id,
          },
        },
        Package: {
          create: packages.map((p) => ({
            deliveryDays: p.deliveryDays,
            name: p.name,
            price: p.price,
            description: p.description,
            features: {
              create: features.map((f) => ({
                name: f.name,
                includedIn: f.includedIn,
              })),
            },
          })),
        },
        questions: {
          create: questions.map((q) => ({
            answerType: q.type,
            question: q.question,
            isRequired: q.required,
          })),
        },
      },
      select: {
        slug: true,
      },
    });
    return service;
  }
  @Get(':username/:slug')
  async getServiceBySlug(
    @Param('username') username: string,
    @Param('slug') slug: string,
  ) {
    const service = await this.prisma.service.findFirst({
      where: {
        freelancer: {
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

        freelancer: {
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
        Package: {
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
        tags: true,
      },
    });
    if (!service) throw new HttpException('No Service Found.', HttpStatus.NOT_FOUND);
    return service;
  }
  @Get(':username')
  async getServicesByUsername(
    @Param('username') username: string,
    @Query('take') take: string,
  ) {
    const toTake = Number.isNaN(parseInt(take)) ? 10 : parseInt(take);
    const services = await this.prisma.service.findMany({
      where: {
        freelancer: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
      },
      select: {
        freelancer: {
          select: {
            username: true,
            name: true,
            avatarUrl: true,
            verified: true,
            profileCompleted: true,
          },
        },
        createdAt: true,
        title: true,
        slug: true,
        tags: true,
        id: true,
        description: true,
      },
      orderBy: [
        {
          updatedAt: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
      take: toTake,
      skip: toTake > 10 ? toTake - 10 : undefined,
    });
    if (services.length === 10) {
      return {
        next: toTake + 10,
        services,
      };
    }
    return { services };
  }
}
