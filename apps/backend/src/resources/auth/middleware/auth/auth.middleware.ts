import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from 'src/resources/auth/auth.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization;
      if (!token) throw Error();
      const user: User = await this.authService.verify(token);
      req.body.user = user;
      next();
    } catch {
      throw new HttpException(
        'Missing or Expired Token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
