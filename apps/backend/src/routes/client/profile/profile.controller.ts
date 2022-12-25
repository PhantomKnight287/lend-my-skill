import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { VerificationService } from 'src/services/verification/verification.service';

@Controller('client/profile')
export class ProfileController {
  constructor(
    protected prisma: PrismaService,
    protected verfication: VerificationService,
  ) {}

  @Get(':username')
  async getProfile(@Param('username') username: string) {
    const user = await this.prisma.client.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
      select: {
        avatarUrl: true,
        bio: true,
        country: true,
        createdAt: true,
        id: true,
        name: true,
        username: true,
        verified: true,
        profileCompleted: true,
        githubId: true,
        linkedinUsername: true,
        facebookUsername: true,
        instagramUsername: true,
        twitterUsername: true,
      },
    });
    if (!user)
      throw new HttpException(
        'No user found with provided username.',
        HttpStatus.NOT_FOUND,
      );
    return user;
  }
}
