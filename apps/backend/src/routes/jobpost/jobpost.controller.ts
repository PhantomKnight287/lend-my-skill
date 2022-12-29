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
        slug: true,
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
      where: {
        author: {
          kycCompleted: true,
        },
      },
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
        slug: true,
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
  @Get(':username/:slug')
  async getJobPost(
    @Param('username') username: string,
    @Param('slug') slug: string,
  ) {
    const jobPost = await this.prisma.jobPost.findFirst({
      where: {
        author: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
        slug: {
          equals: titleToSlug(slug),
          mode: 'insensitive',
        },
      },
      select: {
        author: {
          select: {
            username: true,
            avatarUrl: true,
            name: true,
            verified: true,
            profileCompleted: true,
          },
        },
        budget: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        claimed: true,
        claimedBy: {
          select: {
            username: true,
            avatarUrl: true,
            name: true,
          },
        },
        createdAt: true,
        deadline: true,
        description: true,
        id: true,
        images: true,
        tags: true,
        title: true,
      },
    });
    if (!jobPost)
      throw new HttpException(
        'No Post found with provided queries',
        HttpStatus.NOT_FOUND,
      );
    return jobPost;
  }
  @Get(':username/:slug/quotations')
  async getQuotations(
    @Param('username') username: string,
    @Param('slug') slug: string,
    @Query('take') take: string,
  ) {
    const toTake = Number.isNaN(parseInt(take)) ? 10 : parseInt(take);
    const quotations = await this.prisma.quotation.findMany({
      where: {
        JobPost: {
          author: {
            username: {
              equals: username,
              mode: 'insensitive',
            },
          },
          slug: {
            equals: titleToSlug(slug),
            mode: 'insensitive',
          },
        },
      },
      select: {
        createdAt: true,
        price: true,
        id: true,
        freelancer: {
          select: {
            avatarUrl: true,
            name: true,
            username: true,
            verified: true,
          },
        },
        description: true,
      },
      take: toTake,
      skip: toTake > 10 ? toTake - 10 : undefined,
      orderBy: [
        {
          createdAt: 'desc',
        },
        {
          updatedAt: 'desc',
        },
      ],
    });
    if (!quotations)
      throw new HttpException(
        'No post found with provided details',
        HttpStatus.NOT_FOUND,
      );
    if (quotations.length === 10)
      return {
        quotations,
        next: toTake + 10,
      };
    return { quotations };
  }
}
