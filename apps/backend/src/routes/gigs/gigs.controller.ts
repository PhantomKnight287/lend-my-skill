import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { Token } from 'src/decorators/token/token.decorator';
import { GigsService } from 'src/services/gigs/gigs.service';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { VerificationService } from 'src/services/verification/verification.service';
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
        price: true,
        bannerImage: true,
        id: true,
        title: true,
        tags: true,
        freelancer: {
          select: {
            username: true,
            name: true,
            country: true,
            avatarUrl: true,
          },
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
    const { bannerImage, category, description, images, price, tags, title } =
      body;
    const { profileCompleted, userFound } = await this.verify.verifySeller(id);
    if (!userFound)
      throw new HttpException(
        'No user account found with associated authentication token.',
        HttpStatus.NOT_FOUND,
      );
    if (!profileCompleted)
      throw new HttpException('Profile not completed.', HttpStatus.BAD_REQUEST);
    const isCategoryValid = await this.verify.verifySeller(category);
    if (!isCategoryValid)
      throw new HttpException('Invalid category.', HttpStatus.BAD_REQUEST);
    const data = await this.gigs.createGig({
      bannerImage,
      category,
      description,
      images,
      price,
      tags,
      title,
      userId: id,
    });
    return data;
  }
}
