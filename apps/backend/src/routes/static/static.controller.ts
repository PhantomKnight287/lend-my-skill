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
}
