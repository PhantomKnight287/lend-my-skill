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

  @Get(':chatId/info')
  async getChatInfo(
    @Token({ serialize: true }) { id },
    @Param('chatId') chatId: string,
  ) {
    const { userFound: isValidBuyer } = await this.verify.verifyBuyer(id);
    const { userFound: isValidSeller } = await this.verify.verifySeller(id);
    if (!isValidBuyer && !isValidSeller)
      throw new HttpException('Unauthorized', 401);

    const chat = await this.prisma.chat.findFirst({
      where: {
        id: chatId,
      },
      select: {
        questionAnswered: true,
      },
    });
    if (!chat) throw new HttpException('No Chat Found', 404);
    return chat;
  }
  @Get(':chatId/questions')
  async getChatQuestions(
    @Token({ serialize: true }) { id },
    @Param('chatId') chatId: string,
  ) {
    const { userFound: isValidBuyer } = await this.verify.verifyBuyer(id);
    const { userFound: isValidSeller } = await this.verify.verifySeller(id);
    if (!isValidBuyer && !isValidSeller)
      throw new HttpException('Unauthorized', 401);
    const _q = await this.prisma.chat.findFirst({
      where: {
        id: chatId,
      },
      select: {
        order: {
          select: {
            package: {
              select: {
                service: {
                  select: {
                    questions: {
                      select: {
                        id: true,
                        isRequired: true,
                        question: true,
                        answerType: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    return _q.order.package.service.questions;
  }
}
