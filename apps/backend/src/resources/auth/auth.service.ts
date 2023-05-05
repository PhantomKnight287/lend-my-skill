import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { RegisterResponse } from './types/response';
import { RegisterDTO } from './dto/register.dto';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(protected p: PrismaService) {}

  async register(body: RegisterDTO): Promise<RegisterResponse> {
    const { email, name, password, username } = body;
    const userWithSameEmail = await this.p.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
    });
    if (userWithSameEmail)
      throw new HttpException(
        'Email address already in use',
        HttpStatus.CONFLICT,
      );
    const userWithSameUsername = await this.p.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });
    if (userWithSameUsername) {
      throw new HttpException('Username already taken', HttpStatus.CONFLICT);
    }
    await this.p.user.create({
      data: {
        email,
        name,
        password: await hash(password, 12),
        username,
      },
    });
    return {
      message: 'Account created successfully',
    };
  }
}
