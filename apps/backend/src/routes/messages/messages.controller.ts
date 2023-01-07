import { Controller, Get, HttpException, Param, Query } from '@nestjs/common';
import { Token } from 'src/decorators/token/token.decorator';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Controller('messages')
export class MessagesController {
  constructor(protected prisma: PrismaService) {}

  @Get(':orderId')
  async getMessages(
    @Token({ serialize: true }) {},
    @Query('take') take: string,
    @Param('orderId') orderId: string,
    @Query('skip') skip: string,
  ) {
    const toTake = Number.isNaN(Number(take)) ? 10 : Number(take);
    const toSkip = Number.isNaN(Number(skip)) ? 0 : Number(skip);
    const msgs = await this.prisma.message.findMany({
      where: {
        chat: {
          order: {
            id: orderId,
          },
        },
      },

      select: {
        id: true,
        attachments: true,
        content: true,
        client: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
        freelancer: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
        createdAt: true,
        type: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: toTake - toSkip || 10,
      skip: toSkip || 0,
    });
    if (!msgs) throw new HttpException('No Order Found', 404);
    console.table({ toTake, toSkip, length: msgs.length });

    if (msgs.length === 0) throw new HttpException('No Messages Found', 404);
    if (msgs.length == 10)
      return {
        messages: msgs,
        next: toTake + 10,
      };
    return { messages: msgs };
  }
  @Get(':orderId/count')
  async getMessagesCount(
    @Token({ serialize: true }) {},
    @Param('orderId') orderId: string,
  ) {
    const msgs = await this.prisma.message.count({
      where: {
        chat: {
          order: {
            id: orderId,
          },
        },
      },
    });
    if (!msgs) throw new HttpException('No Order Found', 404);

    return { count: msgs };
  }
}
