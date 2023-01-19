import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { decodeJWT } from 'helpers/jwt';
import { Socket } from 'socket.io';
import { DecodedJWT } from 'src/decorators/token/token.decorator';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { VerificationService } from 'src/services/verification/verification.service';

@WebSocketGateway({
  cors: true,
})
export class MessageGateway implements OnGatewayConnection {
  constructor(
    protected prisma: PrismaService,
    protected verify: VerificationService,
  ) {}
  handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    const orderId = client.handshake.query.orderId;
    if (!token) {
      client.emit('error', 'Authorization header is missing');
      return client.disconnect(true);
    }
    try {
      decodeJWT(token, {
        data: {
          serialize: true,
        },
      });
    } catch {
      client.emit('error', 'Invalid or Expired Authentication Token');
      return client.disconnect(true);
    }
    client.join(orderId);
  }
  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    payload: { message: string | string[]; attachment?: boolean },
  ) {
    const data = decodeJWT(client.handshake.auth.token, {
      data: {
        serialize: true,
      },
    }) as DecodedJWT;
    const chatId = client.handshake.query.chatId;

    const message = await this.prisma.message.create({
      data: {
        attachments: payload.attachment ? payload.message : undefined,
        content: payload.attachment ? undefined : (payload.message as string),
        client:
          data.userType === 'client'
            ? {
                connect: {
                  id: data.id,
                },
              }
            : undefined,
        freelancer:
          data.userType === 'freelancer'
            ? {
                connect: {
                  id: data.id,
                },
              }
            : undefined,
        chat: {
          connect: {
            id: chatId as string,
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
    });
    client.emit('message', message);
    client
      .to(client.handshake.query.orderId as string)
      .emit('message', message);
  }
  @SubscribeMessage('typing')
  async handleTyping(client: Socket) {
    const token = client.handshake.auth.token;
    if (!token) {
      client.emit('error', 'Authorization header is missing');
      return client.disconnect(true);
    }
    let data: DecodedJWT;
    try {
      data = decodeJWT(token, {
        data: {
          serialize: true,
        },
      }) as DecodedJWT;
    } catch {
      client.emit('error', 'Invalid or Expired Authentication Token');
      return client.disconnect(true);
    }
    client.to(client.handshake.query.orderId as string).emit('typing', {
      userType: data.userType,
    });
  }

  @SubscribeMessage('prompt')
  async handlePrompt(client: Socket) {
    const token = client.handshake.auth.token;
    if (!token) {
      client.emit('error', 'Authorization header is missing');
      return client.disconnect(true);
    }
    let data: DecodedJWT;
    try {
      data = decodeJWT(token, {
        data: {
          serialize: true,
        },
      }) as DecodedJWT;
    } catch {
      client.emit('error', 'Invalid or Expired Authentication Token');
      return client.disconnect(true);
    }
    const orderStatus = await this.prisma.order.findFirst({
      where: {
        id: client.handshake.query.orderId as string,
      },
      select: {
        status: true,
        markedAsDoneByFreelancer: true,
        markedAsDoneByClient: true,
      },
    });
    if (!orderStatus) {
      return client.emit('error', 'Invalid order');
    }
    if (orderStatus.status === 'COMPLETED') {
      return client.emit('error', 'Order is already completed');
    }
    if (data.userType === 'client') {
      if (orderStatus.markedAsDoneByFreelancer) {
        await this.prisma.order.update({
          where: {
            id: client.handshake.query.orderId as string,
          },
          data: {
            status: 'COMPLETED',
            markedAsDoneByFreelancer: true,
            markedAsDoneByClient: true,
          },
        });
        const msg = await this.prisma.message.create({
          data: {
            bySystem: true,
            content: 'Order has been completed',
            chat: {
              connect: {
                id: client.handshake.query.chatId as string,
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
        });
        client.emit('message', msg);
        client
          .to(client.handshake.query.orderId as string)
          .emit('message', msg);
        client.emit('completed');
        return client
          .to(client.handshake.query.orderId as string)
          .emit('completed');
      }
      const message = await this.prisma.message.create({
        data: {
          client: {
            connect: {
              id: data.id,
            },
          },
          type: 'CONFIRM_AND_CANCEL_PROMPT',
          content: 'Are you sure you want to mark this order as completed?',
          chat: {
            connect: {
              id: client.handshake.query.chatId as string,
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
      });
      await this.prisma.order.update({
        where: {
          id: client.handshake.query.orderId as string,
        },
        data: {
          markedAsDoneByFreelancer: true,
        },
      });
      client.emit('message', message);
      client
        .to(client.handshake.query.orderId as string)
        .emit('message', message);
    }
    if (data.userType === 'freelancer') {
      if (orderStatus.markedAsDoneByClient) {
        await this.prisma.order.update({
          where: {
            id: client.handshake.query.orderId as string,
          },
          data: {
            status: 'COMPLETED',
            markedAsDoneByFreelancer: true,
            markedAsDoneByClient: true,
          },
        });
        const msg = await this.prisma.message.create({
          data: {
            bySystem: true,
            content: 'Order has been completed',
            chat: {
              connect: {
                id: client.handshake.query.chatId as string,
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
        });
        client.emit('message', msg);
        client
          .to(client.handshake.query.orderId as string)
          .emit('message', msg);
        client.emit('completed');

        return client
          .to(client.handshake.query.orderId as string)
          .emit('completed');
      }
      const message = await this.prisma.message.create({
        data: {
          freelancer: {
            connect: {
              id: data.id,
            },
          },
          type: 'CONFIRM_AND_CANCEL_PROMPT',
          content: 'Are you sure you want to mark this order as completed?',
          chat: {
            connect: {
              id: client.handshake.query.chatId as string,
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
      });
      await this.prisma.order.update({
        where: {
          id: client.handshake.query.orderId as string,
        },
        data: {
          markedAsDoneByFreelancer: true,
        },
      });
      client.emit('message', message);
      client
        .to(client.handshake.query.orderId as string)
        .emit('message', message);
    }
  }
  @SubscribeMessage('reject')
  async rejectProposal(client: Socket) {
    const token = client.handshake.auth.token;
    if (!token) {
      client.emit('error', 'Authorization header is missing');
      return client.disconnect(true);
    }
    let data: DecodedJWT;
    try {
      data = decodeJWT(token, {
        data: {
          serialize: true,
        },
      }) as DecodedJWT;
    } catch {
      client.emit('error', 'Invalid or Expired Authentication Token');
      return client.disconnect(true);
    }
    const orderStatus = await this.prisma.order.findFirst({
      where: {
        id: client.handshake.query.orderId as string,
      },
      select: {
        status: true,
        markedAsDoneByFreelancer: true,
        markedAsDoneByClient: true,
      },
    });
    if (!orderStatus) {
      return client.emit('error', 'Invalid order');
    }
    if (orderStatus.status === 'COMPLETED') {
      return client.emit('error', 'Order is already completed');
    }
    const userInfo =
      data.userType === 'client'
        ? await this.prisma.client.findFirst({
            where: {
              id: data.id,
            },
          })
        : await this.prisma.freelancer.findFirst({
            where: {
              id: data.id,
            },
          });
    if (!userInfo) {
      return client.emit('error', 'Invalid user');
    }

    const message = await this.prisma.message.create({
      data: {
        bySystem: true,
        chat: {
          connect: {
            id: client.handshake.query.chatId as string,
          },
        },
        type: 'BASIC',
        content: `${userInfo.name} has rejected your proposal to mark this order as completed.`,
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
    });
    client.emit('message', message);
    client
      .to(client.handshake.query.orderId as string)
      .emit('message', message);
  }
}
