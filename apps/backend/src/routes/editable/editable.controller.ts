import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { Token } from 'src/decorators/token/token.decorator';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { VerificationService } from 'src/services/verification/verification.service';

@Controller('editable')
export class EditableController {
  constructor(
    protected prisma: PrismaService,
    protected verification: VerificationService,
  ) {}

  @Get('profile/:username')
  async isProfileEditable(
    @Token({ serialize: true }) { id },
    @Param('username') username: string,
  ) {
    const { userFound: isValidFreelancer } =
      await this.verification.verifySeller(id);
    const { userFound: isValidClient } = await this.verification.verifyBuyer(
      id,
    );

    if (!isValidClient && !isValidFreelancer)
      throw new HttpException(
        "You're not allowed to perform this action.",
        HttpStatus.UNAUTHORIZED,
      );
    const userType = isValidClient ? 'client' : 'freelancer';
    const userInfo =
      userType === 'client'
        ? await this.prisma.client.findFirst({
            where: {
              username: {
                equals: username,
                mode: 'insensitive',
              },
            },
          })
        : await this.prisma.freelancer.findFirst({
            where: {
              username: {
                equals: username,
                mode: 'insensitive',
              },
            },
          });
    if (!userInfo)
      throw new HttpException(
        'No user found with provided username.',
        HttpStatus.NOT_FOUND,
      );
    return {
      editable: userInfo.id === id,
    };
  }
}
