import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { REFRESH_SECRET } from 'src/constants';

interface DecodedJWT extends JwtPayload {
  id: string;
}

export const RefreshToken = createParamDecorator(
  (
    data: { optional?: boolean; serialize?: boolean },
    ctx: ExecutionContext,
  ): string | DecodedJWT => {
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
        jwt = verify(token, REFRESH_SECRET) as unknown as DecodedJWT;
        return jwt;
      } catch (err) {
        throw new HttpException(
          'Invalid or Expired Authentication Token',
          HttpStatus.FORBIDDEN,
        );
      }
    }
    return data?.serialize ? jwt : token;
  },
);
