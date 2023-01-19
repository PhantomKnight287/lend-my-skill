import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Token } from 'src/decorators/token/token.decorator';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { VerificationService } from 'src/services/verification/verification.service';
import { CreateReviewDto } from 'src/validators/reviews.validator';

@Controller('reviews')
export class ReviewsController {
  constructor(
    protected prisma: PrismaService,
    protected verification: VerificationService,
  ) {}

  @Post('create')
  async createReview(
    @Body() body: CreateReviewDto,
    @Token({ serialize: true }) { id },
  ) {
    const { userFound: isValidClient } = await this.verification.verifyBuyer(
      id,
    );
    const isValidFreelancer =
      await this.verification.verifyFreelancerByUsername(
        body.freelancerUsername,
      );
    if (!isValidClient || !isValidFreelancer) {
      throw new HttpException('Invalid client or freelancer', 400);
    }
    const oldReview = await this.prisma.review.findFirst({
      where: {
        author: {
          id: id,
        },
        freelancer: {
          username: {
            equals: body.freelancerUsername,
            mode: 'insensitive',
          },
        },
      },
    });
    if (oldReview) {
      throw new HttpException('You already reviewed this freelancer', 400);
    }
    const freelancer = await this.prisma.freelancer.findFirst({
      where: {
        username: {
          equals: body.freelancerUsername,
          mode: 'insensitive',
        },
      },
      include: {
        reviews: true,
      },
    });
    const order = await this.prisma.order.findFirst({
      where: {
        client: {
          id: id,
        },
        freelancer: {
          id: freelancer.id,
        },
      },
    });
    if (!order) {
      throw new HttpException('You have not worked with this freelancer', 400);
    }
    const review = await this.prisma.review.create({
      data: {
        rating: body.rating,
        comment: body.content,
        author: {
          connect: {
            id: id,
          },
        },
        freelancer: {
          connect: {
            id: freelancer.id,
          },
        },
      },
    });
    const newRating =
      (freelancer.rating + body.rating) / (freelancer.reviews.length + 1);
    await this.prisma.freelancer.update({
      where: {
        id: freelancer.id,
      },
      data: {
        rating: newRating,
      },
    });
    return review;
  }

  @Get(':username')
  async getReviews(
    @Param('username') username: string,
    @Query('take') take: string,
  ) {
    const toTake = Number.isNaN(Number(take)) ? 10 : Number(take);

    const isValidFreelancer =
      await this.verification.verifyFreelancerByUsername(username);
    if (!isValidFreelancer) {
      throw new HttpException('Invalid freelancer', 404);
    }
    const reviews = await this.prisma.review.findMany({
      where: {
        freelancer: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
      },
      select: {
        author: {
          select: {
            avatarUrl: true,
            id: true,
            username: true,
            name: true,
          },
        },
        comment: true,
        id: true,
        rating: true,
        createdAt: true,
      },
      take: toTake,
      skip: toTake > 10 ? toTake - 10 : undefined,
    });

    if (reviews.length === 10)
      return {
        reviews,
        next: toTake + 10,
      };
    return { reviews };
  }
}
