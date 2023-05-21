import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(protected p: PrismaService) {}

  async getMessagesCount(orderId: string) {
    const count = await this.p.message.count({
      where: {
        chat: {
          orderId: orderId,
        },
      },
    });
    return {
      count: count,
    };
  }
  async getMessages(orderId: string, skip?: string, take?: string) {
    const toTake = Number.isNaN(Number(take)) ? 30 : Number(take);
    const toSkip = Number.isNaN(Number(skip)) ? 0 : Number(skip);
    const msgs = await this.p.message.findMany({
      where: {
        chat: {
          order: {
            id: orderId,
          },
        },
      },
      select: {
        id: true,
        content: true,
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
        sender: true,
        createdAt: true,
        type: true,
        promptSender: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: toTake - toSkip || 10,
      skip: toSkip || 0,
    });
    if (!msgs) throw new HttpException('No Order Found', 404);

    if (msgs.length === 0) throw new HttpException('No Messages Found', 404);
    if (msgs.length == 10)
      return {
        messages: msgs,
        next: toTake + 10,
      };
    return { messages: msgs };
  }
}
