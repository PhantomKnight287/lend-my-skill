import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Controller('static')
export class StaticController {
  constructor(protected prisma: PrismaService) {}

  @Get('profiles')
  async generateClients() {
    const clients = await this.prisma.client.findMany({
      select: {
        username: true,
      },
    });
    const freelancers = await this.prisma.freelancer.findMany({
      select: {
        username: true,
      },
    });
    return [...clients, ...freelancers];
  }
  @Get('job-posts')
  async generateJobPosts() {
    const jobPosts = await this.prisma.jobPost.findMany({
      select: {
        slug: true,
        author: {
          select: {
            username: true,
          },
        },
      },
    });
    const f = jobPosts.map(j=>j.author.username && j.slug)
    return f;
  }
  @Get('categories')
  async generateCategories() {
    const categories = await this.prisma.category.findMany({
      select: {
        slug: true,
      },
    });
    return categories;
  }
  @Get('services')
  async generateServices() {
    const services = await this.prisma.service.findMany({
      select: {
        freelancer: {
          select: {
            username: true,
          },
        },
        slug: true,
      },
    });
    const f = services.map(s=>s.freelancer.username && s.slug)
    return f;
  }
}
