import { HttpException, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SIGN_SECRET } from 'src/constants';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreateUserDto } from './dto/create-auth.dto';
import { LoginUserDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(protected p: PrismaService) {}

  async create(c: CreateUserDto): Promise<{
    token: string;
    user: {
      username: string;
      role: string;
      name: string;
      id: string;
      profileCompleted: boolean;
    };
  }> {
    const { email, password, country, confirmPassword, username, role, name } =
      c;
    const oldUser = await this.p.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            username,
          },
        ],
      },
    });
    if (oldUser)
      throw new HttpException('Email or Username already in use.', 409);
    if (password !== confirmPassword)
      throw new HttpException('Passwords do not match.', 400);
    const user = await this.p.user.create({
      data: {
        email,
        name,
        password: await hash(password, 10),
        username,
        country,
        role,
      },
    });
    const token = sign(
      {
        id: user.id,
        role: user.role,
      },
      SIGN_SECRET,
    );
    return {
      token,
      user: {
        role: user.role,
        username: user.username,
        id: user.id,
        name: user.name,
        profileCompleted: false,
      },
    };
  }

  async login(createAuthDto: LoginUserDto): Promise<{
    user: {
      username: string;
      role: string;
      id: string;
      name: string;
      profileCompleted: boolean;
    };
    token: string;
  }> {
    const { email, password } = createAuthDto;
    const user = await this.p.user.findFirst({
      where: {
        email,
      },
    });
    if (!user)
      throw new HttpException('No User found with provided email address', 404);
    const isPasswordSame = await compare(password, user.password);
    if (isPasswordSame === false)
      throw new HttpException('Incorrect Password', 401);
    const token = sign(
      {
        id: user.id,
        role: user.role,
      },
      SIGN_SECRET,
    );
    return {
      user: {
        role: user.role,
        username: user.username,
        id: user.id,
        name: user.name,
        profileCompleted: user.profileCompleted,
      },
      token,
    };
  }
}
