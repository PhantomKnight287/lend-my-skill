import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(protected p: PrismaService) {}

  async findUser(id: string) {
    const user = await this.p.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        username: true,
        profileCompleted: true,
      },
    });
    if (!user) throw new HttpException('No User Found', 404);
    return user;
  }
}
