import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(protected p: PrismaService) {}

  async getChatInfo(orderId: string) {
    const order = await this.p.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        chat: {
          select: {
            createdAt: true,
            id: true,
          },
        },
        client: {
          select: {
            name: true,
            username: true,
            avatarUrl: true,
            id: true,
            verified: true,
          },
        },
        freelancer: {
          select: {
            name: true,
            username: true,
            avatarUrl: true,
            id: true,
            verified: true,
          },
        },
        orderState: true,
        id: true,
        createdAt: true,
      },
    });
    if (!order) throw new HttpException('No order found', 404);
    return order;
  }
}
