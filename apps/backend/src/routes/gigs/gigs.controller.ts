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
import { GigsService } from 'src/services/gigs/gigs.service';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { VerificationService } from 'src/services/verification/verification.service';
import { titleToSlug } from 'src/utils/slug';
import { CreateGigDto } from 'src/validators/gigs.validator';

@Controller('gigs')
export class GigsController {
  constructor(
    protected prisma: PrismaService,
    protected gigs: GigsService,
    protected verify: VerificationService,
  ) {}

  @Get()
  async getGigs(@Query('take') take: string) {
    const toOutput = Number.isNaN(Number(take)) ? 10 : Number(take);

    const data = await this.prisma.gig.findMany({
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
        gigs: data,
        next: toOutput + 10,
      };
    }
    return {
      gigs: data,
    };
  }
  @Post('create')
  async createGig(
    @Body() body: CreateGigDto,
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

    const gig = await this.prisma.gig.create({
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
    return gig;
  }
  @Get(':username/:slug')
  async getGigBySlug(
    @Param('username') username: string,
    @Param('slug') slug: string,
  ) {
    const gig = await this.prisma.gig.findFirst({
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
    if (!gig) throw new HttpException('No Gig Found.', HttpStatus.NOT_FOUND);
    return gig;
  }
  @Get(':username')
  async getGigsByUsername(
    @Param('username') username: string,
    @Query('take') take: string,
  ) {
    const toTake = Number.isNaN(parseInt(take)) ? 10 : parseInt(take);
    const gigs = await this.prisma.gig.findMany({
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
    if (gigs.length === 10) {
      return {
        next: toTake + 10,
        gigs,
      };
    }
    return { gigs };
  }
}
