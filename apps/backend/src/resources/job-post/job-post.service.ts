import { HttpException, Injectable } from '@nestjs/common';
import { stringToSlug } from 'src/helpers/slug';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreateJobPostDTO } from './dto/create.dto';

@Injectable()
export class JobPostService {
  constructor(protected p: PrismaService) {}

  async createJobPost(data: CreateJobPostDTO, userId: string) {
    const { category, deadline, description, images, price, tags, title } =
      data;

    const c = await this.p.category.findFirst({
      where: {
        id: category,
      },
    });
    if (!c) throw new HttpException('No category found with provided id.', 404);
    const post = await this.p.jobPost.create({
      data: {
        description,
        slug: stringToSlug(title, 10),
        title,
        author: {
          connect: { id: userId },
        },
        category: {
          connect: {
            id: category,
          },
        },
        tags: {
          connect: tags.map((tag) => ({ id: tag })),
        },
        images,
        deadline,
        budget: price,
      },
      select: {
        slug: true,
      },
    });
    return post;
  }
}
