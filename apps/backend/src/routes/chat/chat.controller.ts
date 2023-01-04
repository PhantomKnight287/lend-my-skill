import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { Token } from 'src/decorators/token/token.decorator';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { VerificationService } from 'src/services/verification/verification.service';

@Controller('chat')
export class ChatController {
  constructor(
    protected prisma: PrismaService,
    protected verify: VerificationService,
  ) {}
  @Get(':orderId')
  async getChatByOrderId(
    @Param('orderId') orderId: string,
    @Token({ serialize: true }) { id },
  ) {
    const { userFound: isValidBuyer } = await this.verify.verifyBuyer(id);
    const { userFound: isValidSeller } = await this.verify.verifySeller(id);
    if (!isValidBuyer && !isValidSeller)
      throw new HttpException('Unauthorized', 401);
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
      },
      select: {
        Chat: {
          select: {
            id: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
            verified: true,
          },
        },
        freelancer: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
            verified: true,
          },
        },
        id: true,
        status: true,
      },
    });
    if (!order) throw new HttpException('No Order Found', 404);
    return order;
  }
}
