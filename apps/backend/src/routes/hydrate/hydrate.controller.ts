import { Controller, Get, HttpException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { SIGN_SECRET } from 'src/constants';
import { RefreshToken } from 'src/decorators/refresh/refresh.decorator';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { VerificationService } from 'src/services/verification/verification.service';

@Controller('hydrate')
export class HydrateController {
  constructor(
    protected prisma: PrismaService,
    protected verification: VerificationService,
  ) {}

  @Get('token')
  async generateToken(@RefreshToken({ serialize: true }) { id }) {
    const { userFound: isValidFreelancer } =
      await this.verification.verifySeller(id);
    const { userFound: isValidClient } = await this.verification.verifyBuyer(
      id,
    );
    if (!isValidFreelancer && !isValidClient) {
      throw new HttpException('Unauthorized', 401);
    }
    const token = sign(
      { id, userType: isValidClient ? 'client' : 'freelancer' },
      SIGN_SECRET,
      { expiresIn: '1d' },
    );
    return {
      token,
    };
  }
}
