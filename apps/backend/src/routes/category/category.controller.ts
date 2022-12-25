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
import { PrismaService } from 'src/services/prisma/prisma.service';
import { VerificationService } from 'src/services/verification/verification.service';
import { titleToSlug } from 'src/utils/slug';

@Controller('categories')
export class CategoryController {
  constructor(
    protected prisma: PrismaService,
    protected verification: VerificationService,
  ) {}

  @Get()
  async fetchAllCategories() {
    const categories = await this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return categories;
  }
  @Post('create')
  async createCategory(
    @Token({ serialize: true }) { id },
    @Body() body: { name: string },
  ) {
    if (!body.name)
      throw new HttpException('Name of category is required', 400);
    const { userFound: isValidClient } = await this.verification.verifyBuyer(
      id,
    );
    const { userFound: isValidFreelancer } =
      await this.verification.verifySeller(id);
    if (!isValidClient && !isValidFreelancer) {
      throw new HttpException(
        'You are not allowed to perform this action',
        403,
      );
    }
    const category = await this.prisma.category.create({
      data: {
        name: body.name,
        slug: `${titleToSlug(body.name)}-${nanoid(10)}`,
      },
      select: {
        id: true,
        name: true,
      },
    });
    return category;
  }
  @Get(':slug')
  async getCategory(@Param('slug') slug: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        slug: {
          equals: slug,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        Gig: {
          select: {
            id: true,
          },
        },
        JobPost: {
          select: {
            _count: true,
          },
        },
      },
    });
    const gigs = category.Gig.length;
    delete category.Gig;
    const jobs = category.JobPost.length;
    delete category.JobPost;
    if (!category)
      throw new HttpException('No category found', HttpStatus.NOT_FOUND);
    return { ...category, gigs, jobs };
  }
  @Get(':id/job-posts')
  async getJobPostsRelatedToCategory(
    @Param('id') id: string,
    @Query('take') take: string,
  ) {
    const toTake = Number.isNaN(parseInt(take)) ? 10 : parseInt(take);
    const category = await this.prisma.category.findFirst({
      where: {
        id,
      },
    });
    if (!category)
      throw new HttpException('No Category found', HttpStatus.NOT_FOUND);
    const jobPost = await this.prisma.jobPost.findMany({
      where: {
        category: {
          id: category.id,
        },
      },
      select: {
        title: true,
        id: true,
        slug: true,
        author: {
          select: {
            username: true,
            avatarUrl: true,
            name: true,
            verified: true,
          },
        },
        tags: true,
        createdAt: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
        {
          updatedAt: 'desc',
        },
      ],
      take: toTake,
      skip: toTake > 10 ? toTake - 10 : undefined,
    });
    if (jobPost.length === 10)
      return {
        posts: jobPost,
        next: toTake + 10,
      };
    return {
      posts: jobPost,
    };
  }
}
