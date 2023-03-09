import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { UpdateProfileDTO } from './dto/update-profile.dto';

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
        role: true,
        avatarUrl: true,
        bio: true,
        country: true,
      },
    });
    if (!user) throw new HttpException('No User Found', 404);
    return user;
  }
  async updateUser(id: string, body: UpdateProfileDTO) {
    const user = await this.p.user.findFirst({
      where: {
        id,
      },
    });
    if (!user) throw new HttpException('No User Found', 404);
    const { avatarUrl, bio, country } = body;
    await this.p.user.update({
      where: {
        id,
      },
      data: {
        avatarUrl: avatarUrl || user.avatarUrl,
        bio: bio || user.bio,
        country: country || user.country,
      },
    });
    return {
      updated: true,
    };
  }
  async getProfileByUsername(username: string) {
    const user = await this.p.user.findFirst({
      where: {
        username,
      },
      select: {
        id: true,
        avatarUrl: true,
        bio: true,
        country: true,
        createdAt: true,
        verified: true,
        name: true,
        username: true,
      },
    });
    if (!user) throw new HttpException('No User Found', 404);

    return user;
  }
}
