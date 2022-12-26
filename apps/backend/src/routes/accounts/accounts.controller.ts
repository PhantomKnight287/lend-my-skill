import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { DecodedJWT, Token } from 'src/decorators/token/token.decorator';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Controller('accounts')
export class AccountsController {
  constructor(protected prisma: PrismaService) {}

  @Post('github')
  async updateGithubId(
    @Body()
    body: {
      id: string;
    },
    @Token({ serialize: true }) { userType, id }: DecodedJWT,
  ) {
    if (!body.id)
      throw new HttpException('Id is required', HttpStatus.BAD_REQUEST);
    const user =
      userType === 'client'
        ? await this.prisma.client.findFirst({
            where: { id },
          })
        : await this.prisma.freelancer.findFirst({
            where: {
              id,
            },
          });
    if (!user) throw new HttpException('No User found', HttpStatus.NOT_FOUND);
    if (userType === 'client') {
      await this.prisma.client.update({
        where: {
          id,
        },
        data: {
          githubId: body.id,
        },
      });
    } else {
      await this.prisma.freelancer.update({
        where: {
          id,
        },
        data: {
          githubId: body.id,
        },
      });
    }
    return {
      updated: true,
    };
  }
}
