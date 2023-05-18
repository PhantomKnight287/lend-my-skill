import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(protected p: PrismaService) {}

  async getOrders(userId: string, take?: string) {
    const toTake = Number.isNaN(Number(take)) ? 10 : Number(take);
    const orders = await this.p.order.findMany({
      where: {
        OR: [
          {
            client: {
              id: userId,
            },
          },
          {
            freelancer: {
              id: userId,
            },
          },
        ],
      },
      select: {
        client: {
          select: {
            name: true,
            username: true,
          },
        },
        freelancer: {
          select: {
            name: true,
            username: true,
          },
        },
        couponCode: {
          select: {
            code: true,
          },
        },
        orderState: true,
        transaction: {
          select: {
            amount: true,
          },
        },
        id: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: toTake,
      skip: toTake > 10 ? toTake - 10 : undefined,
    });
    if (orders.length === 0) {
      throw new HttpException('No orders found', 404);
    }
    const res = { orders };
    if (orders.length === 10) {
      res['next'] = toTake + 10;
    }
    return res;
  }

  async getOrderInfo(orderId: string) {
    const order = await this.p.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        chat: {
          select: {
            id: true,
          },
        },
        client: {
          select: {
            avatarUrl: true,
            name: true,
            username: true,
          },
        },
        freelancer: {
          select: {
            avatarUrl: true,
            name: true,
            username: true,
          },
        },
        orderState: true,
        id: true,
        createdAt: true,
        service: {
          select: {
            slug: true,
          },
        },
        package: {
          select: {
            name: true,
          },
        },
        transaction: {
          select: {
            amount: true,
          },
        },
      },
    });
    if (!order) throw new HttpException('No order found', 404);
    return order;
  }
}
