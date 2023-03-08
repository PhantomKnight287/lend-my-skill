import { HttpException, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SIGN_SECRET } from 'src/constants';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginUserDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(protected p: PrismaService) {}

  create(createAuthDto: LoginUserDto) {
    const { email, password } = createAuthDto;
  }

  async login(createAuthDto: LoginUserDto): Promise<{
    user: {
      username: string;
      role: string;
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
      },
      token,
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
