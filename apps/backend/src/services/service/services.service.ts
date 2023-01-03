import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CreateServiceInput {
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
export class ServiceService {
  constructor(protected prisma: PrismaService) {}
}
