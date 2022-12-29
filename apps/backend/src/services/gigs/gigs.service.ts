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
}
