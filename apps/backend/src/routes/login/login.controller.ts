import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { REFRESH_SECRET, SIGN_SECRET } from 'src/constants';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { VerificationService } from 'src/services/verification/verification.service';
import { SellerLoginDto } from 'src/validators/auth.validator';

@Controller('login')
export class LoginController {
  constructor(
    protected prisma: PrismaService,
    protected verification: VerificationService,
  ) {}

  @Post()
  async login(@Body() body: SellerLoginDto) {
    const { email, password } = body;
    const isValidFreelancer = await this.prisma.freelancer.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
      select: {
        password: true,
        id: true,
        avatarUrl: true,
        name: true,
        username: true,
      },
    });
    const isValidClient = await this.prisma.client.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
      select: {
        password: true,
        id: true,
        avatarUrl: true,
        name: true,
        username: true,
      },
    });
    if (!isValidClient && !isValidFreelancer)
      throw new HttpException(
        'No account found with given email.',
        HttpStatus.NOT_FOUND,
      );
    const profile = isValidClient ? isValidClient : isValidFreelancer;

    const isPasswordCorrect = await compare(password, profile.password);
    if (!isPasswordCorrect)
      throw new HttpException('Incorrect Password.', HttpStatus.UNAUTHORIZED);
    delete profile.password;

    const token = sign(
      {
        id: profile.id,
        userType: isValidClient ? 'client' : 'freelancer',
      },
      SIGN_SECRET,
    );
    const refreshToken = sign(
      {
        id: profile.id,
        userType: isValidClient ? 'client' : 'freelancer',
      },
      REFRESH_SECRET,
      {
        expiresIn: '7d',
      },
    );

    return {
      user: {
        ...profile,
        type: isValidClient ? 'client' : 'freelancer',
      },
      tokens: {
        auth: token,
        refresh: refreshToken,
      },
    };
  }
}
