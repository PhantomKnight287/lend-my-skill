import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { RegisterDto } from 'src/validators/auth.validator';
import { sign } from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(protected prisma: PrismaService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const { email, password, username, name } = body;

    const oldUserWithSameEmail = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (oldUserWithSameEmail) {
      throw new HttpException(
        'User with same email already exists',
        HttpStatus.CONFLICT,
      );
    }
    const oldUserWithSameUsername = await this.prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });
    if (oldUserWithSameUsername) {
      throw new HttpException(
        'User with same username already exists',
        HttpStatus.CONFLICT,
      );
    }
    const user = await this.prisma.user.create({
      data: {
        email,
        password,
        username,
        name,
      },
      select: {
        username: true,
        id: true,
        name: true,
      },
    });
    const token = sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    const refreshToken = sign({ id: user.id }, process.env.REFRESH_TOKEN, {
      expiresIn: '7d',
    });

    return {
      user,
      tokens: {
        auth: token,
        refresh: refreshToken,
      },
    };
  }
}
