import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import {
  SellerLoginDto,
  SellerRegisterDto,
} from 'src/validators/auth.validator';
import { sign } from 'jsonwebtoken';
import { RefreshToken } from 'src/decorators/refresh/refresh.decorator';
import { REFRESH_SECRET, SIGN_SECRET } from 'src/constants';
import { compare, hash } from 'bcrypt';
import { VerificationService } from 'src/services/verification/verification.service';

@Controller('freelancer/auth')
export class AuthController {
  constructor(
    protected prisma: PrismaService,
    protected verification: VerificationService,
  ) {}

  @Post('register')
  async register(@Body() body: SellerRegisterDto) {
    const { email, password, username, name, country } = body;

    const oldUserWithSameEmail = await this.prisma.freelancer.findFirst({
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
    const oldUserWithSameUsername = await this.prisma.freelancer.findFirst({
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
    const oldClientWithSameUsername = await this.prisma.client.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });
    if (oldClientWithSameUsername)
      throw new HttpException(
        'Username is already taken.',
        HttpStatus.CONFLICT,
      );
    const isAlreadyRegistered =
      await this.verification.isEmailAlreadyRegistered(email, 'buyer');
    if (isAlreadyRegistered) {
      throw new HttpException(
        'Email already registered as buyer',
        HttpStatus.CONFLICT,
      );
    }
    const user = await this.prisma.freelancer.create({
      data: {
        email,
        password: await hash(password, 12),
        username,
        name,
        country: country || 'India',
      },
      select: {
        username: true,
        id: true,
        name: true,
      },
    });
    const token = sign(
      { id: user.id, userType: 'freelancer' },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      },
    );
    const refreshToken = sign(
      { id: user.id, userType: 'freelancer' },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: '7d',
      },
    );

    return {
      user,
      tokens: {
        auth: token,
        refresh: refreshToken,
      },
    };
  }
  @Get('refresh')
  async refresh(@RefreshToken({ serialize: true }) { id }) {
    const token = sign({ id, userType: 'freelancer' }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    return {
      token,
    };
  }
  @Post('login')
  async login(@Body() body: SellerLoginDto) {
    const { email, password } = body;
    const user = await this.prisma.freelancer.findFirst({
      where: {
        email,
      },
      select: {
        username: true,
        id: true,
        name: true,
        avatarUrl: true,
        password: true,
        banned: true,
        banReason: true,
      },
    });
    if (!user) {
      throw new HttpException(
        'No User found with provided email.',
        HttpStatus.NOT_FOUND,
      );
    }
    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new HttpException('Incorrect Password', HttpStatus.UNAUTHORIZED);
    }
    if (user.banned) {
      throw new HttpException(
        `You Have Been Banned: ${user.banReason}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = sign({ id: user.id, userType: 'freelancer' }, SIGN_SECRET, {
      expiresIn: '1d',
    });
    const refreshToken = sign(
      { id: user.id, userType: 'freelancer' },
      REFRESH_SECRET,
      {
        expiresIn: '7d',
      },
    );
    delete user.password;
    return {
      user,
      tokens: {
        auth: token,
        refresh: refreshToken,
      },
    };
  }
}
