import { Injectable } from '@nestjs/common';
import { titleToSlug } from 'src/utils/slug';
import { PrismaService } from '../prisma/prisma.service';

interface CreateGigInput {
  title: string;
  description: string;
  category: string;
  tags: string[];
  bannerImage: string;
  price: number;
  userId: string;
  images: string[];
}

@Injectable()
export class GigsService {
  constructor(protected prisma: PrismaService) {}

  async createGig(props: CreateGigInput) {
    return this.prisma.gig.create({
      data: {
        bannerImage: props.bannerImage,
        category: {
          connect: {
            id: props.category,
          },
        },
        description: props.description,
        price: props.price,
        tags: props.tags,
        title: props.title,
        images: props.images,
        freelancer: {
          connect: {
            id: props.userId,
          },
        },
        slug: titleToSlug(props.title),
      },
    });
  }
}
