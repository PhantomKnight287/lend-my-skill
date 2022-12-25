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
import { Token } from 'src/decorators/token/token.decorator';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { VerificationService } from 'src/services/verification/verification.service';
import { titleToSlug } from 'src/utils/slug';
import { CreateJobDto } from 'src/validators/jobpost.validator';
import * as nanoid from 'nanoid';

@Controller('jobpost')
export class JobpostController {
  constructor(
    protected prisma: PrismaService,
    protected verify: VerificationService,
  ) {}

  @Get()
  async getJobPosts(@Query('take') take: string) {
    const toTake = Number.isNaN(Number(take)) ? 10 : Number(take);
    const posts = await this.prisma.jobPost.findMany({
      select: {
        id: true,
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            country: true,
            username: true,
          },
        },
        createdAt: true,
        description: true,
        budget: true,
        title: true,
        tags: true,
      },
      orderBy: [
        {
          updatedAt: 'desc',
        },
        {
          quotation: {
            _count: 'desc',
          },
        },
      ],
      take: toTake,
      skip: toTake > 10 ? toTake - 10 : 0,
    });
    if (posts.length === 10)
      return {
        posts,
        next: toTake + 10,
      };
    return {
      posts,
    };
  }
  @Get(':username')
  async getJobPostsByUsername(
    @Query('take') take: string,
    @Param('username') username: string,
  ) {
    const toTake = Number.isNaN(Number(take)) ? 10 : Number(take);
    const posts = await this.prisma.jobPost.findMany({
      where: {
        author: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
      },
      select: {
        id: true,
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            country: true,
            username: true,
          },
        },
        createdAt: true,
        description: true,
        budget: true,
        title: true,
        tags: true,
      },
      orderBy: [
        {
          updatedAt: 'desc',
        },
        {
          quotation: {
            _count: 'desc',
          },
        },
      ],
      take: toTake,
      skip: toTake > 10 ? toTake - 10 : 0,
    });
    if (posts.length === 10)
      return {
        posts,
        next: toTake + 10,
      };
    return {
      posts,
    };
  }
  @Post('create')
  async createJobPost(
    @Token({ serialize: true }) { id },
    @Body() body: CreateJobDto,
  ) {
    const isUserValid = await this.verify.verifyBuyer(id);
    if (!isUserValid)
      throw new HttpException(
        'No user found with provided token',
        HttpStatus.NOT_FOUND,
      );
    const isValidCategory = await this.verify.verifyCategory(body.category);
    if (!isValidCategory)
      throw new HttpException(
        'No category found with provided id',
        HttpStatus.NOT_FOUND,
      );
    const { title, description, price, tags, category, images, deadline } =
      body;
    const post = await this.prisma.jobPost.create({
      data: {
        title,
        description,
        budget: price,
        tags,
        category: { connect: { id: category } },
        images,
        author: { connect: { id } },
        slug: `${titleToSlug(title)}-${nanoid.nanoid(10)}`,
        deadline,
      },
      select: {
        slug: true,
      },
    });
    return post;
  }
}
