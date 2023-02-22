import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { SIGN_SECRET } from 'src/constants';
import { PrismaService } from 'src/services/prisma/prisma.service';

export interface DecodedJWT extends JwtPayload {
  id: string;
  userType: 'client' | 'freelancer';
}

export const Token = createParamDecorator(
  async (
    data: { optional?: boolean; serialize?: boolean },
    ctx: ExecutionContext,
  ): Promise<string | DecodedJWT> => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const token = request.headers['authorization']?.replace('Bearer ', '');
    if (!token && !data?.optional)
      throw new HttpException(
        'Authentication Token is required to access this resource.',
        HttpStatus.UNAUTHORIZED,
      );
    let jwt: DecodedJWT = undefined;
    if (data?.serialize) {
      try {
        jwt = verify(token, SIGN_SECRET) as unknown as DecodedJWT;
      } catch (err) {
        throw new HttpException(
          'Invalid or Expired Authentication Token',
          HttpStatus.FORBIDDEN,
        );
      }
    }
    const prisma = new PrismaService();
    const userRole = jwt.userType;
    const user =
      userRole === 'client'
        ? await prisma.client.findUnique({ where: { id: jwt.id } })
        : await prisma.freelancer.findUnique({ where: { id: jwt.id } });
    if (!user && !data?.optional) {
      throw new HttpException(
        'Authentication Token is required to access this resource.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (user.banned && !data?.optional) {
      throw new HttpException(
        `You have been banned: ${user.banReason}`,
        HttpStatus.FORBIDDEN,
      );
    }
    return data?.serialize ? jwt : token;
  },
);
