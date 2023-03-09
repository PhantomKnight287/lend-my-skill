import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class StaticService {
  constructor(protected p: PrismaService) {}

  async getStaticProfiles() {
    return await this.p.user.findMany({
      select: {
        username: true,
      },
    });
  }
}
