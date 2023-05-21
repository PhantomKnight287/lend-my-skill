import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { verify } from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { SIGN_SECRET } from 'src/constants';
import { DecodedJWT } from 'src/decorators/token/token.decorator';
import { PrismaService } from 'src/services/prisma/prisma.service';

@WebSocketGateway({
  cors: true,
  transports: ['websocket'],
  path: '/v1/socket.io',
})
export class ChatGateway implements OnGatewayConnection {
  constructor(protected prisma: PrismaService) {}
  handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    const orderId = client.handshake.query.orderId;
    if (!token) {
      client.emit('error', 'Authorization header is missing');
      return client.disconnect(true);
    }
    try {
      verify(token, SIGN_SECRET);
    } catch {
      client.emit('error', 'Invalid or Expired Authentication Token');
      return client.disconnect(true);
    }
    client.join(orderId);
  }
  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: { message: string }) {
    const data = verify(client.handshake.auth.token, SIGN_SECRET) as DecodedJWT;
    const chatId = client.handshake.query.chatId;
    const order = await this.prisma.order.findFirst({
      where: {
        id: client.handshake.query.orderId as string,
      },
    });
    if (!order) {
      return client.emit('error', 'Invalid order');
    }
    if (order.orderState === 'Completed') {
      return client.emit('error', 'Order is already completed');
    }
    const message = await this.prisma.message.create({
      data: {
        content: payload.message,
        sender: data.role === 'Client' ? 'Client' : 'Freelancer',
        chat: {
          connect: {
            id: chatId as string,
          },
        },
        author: {
          connect: {
            id: data.id,
          },
        },
        type: 'Text',
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
      data = verify(token, SIGN_SECRET) as DecodedJWT;
    } catch {
      client.emit('error', 'Invalid or Expired Authentication Token');
      return client.disconnect(true);
    }
    client.to(client.handshake.query.orderId as string).emit('typing', {
      userType: data.role,
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
      data = verify(token, SIGN_SECRET) as DecodedJWT;
    } catch {
      client.emit('error', 'Invalid or Expired Authentication Token');
      return client.disconnect(true);
    }
    const orderStatus = await this.prisma.order.findFirst({
      where: {
        id: client.handshake.query.orderId as string,
      },
      select: {
        markedAsDoneByFreelancer: true,
        markedAsDoneByClient: true,
        orderState: true,
      },
    });
    if (!orderStatus) {
      return client.emit('error', 'Invalid order');
    }
    if (orderStatus.orderState === 'Completed') {
      return client.emit('error', 'Order is already completed');
    }
    const user = await this.prisma.user.findFirst({
      where: {
        id: data.id,
      },
    })!;
    if (data.role === 'Client') {
      if (orderStatus.markedAsDoneByFreelancer) {
        await this.prisma.order.update({
          where: {
            id: client.handshake.query.orderId as string,
          },
          data: {
            orderState: 'Completed',
            markedAsDoneByFreelancer: true,
            markedAsDoneByClient: true,
          },
        });
        const msg = await this.prisma.message.create({
          data: {
            sender: 'System',
            content: '# Order has been completed',
            chat: {
              connect: {
                id: client.handshake.query.chatId as string,
              },
            },
            type: 'Text',
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
          sender: 'System',
          type: 'Prompt',
          content: `# ${user.name} wants to mark this order as completed. 
Marking this order as completed required consent of both parties. Are you sure you want to mark this as completed?`,
          promptSender: data.role,
          chat: {
            connect: {
              id: client.handshake.query.chatId as string,
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
    if (data.role === 'Freelancer') {
      if (orderStatus.markedAsDoneByClient) {
        await this.prisma.order.update({
          where: {
            id: client.handshake.query.orderId as string,
          },
          data: {
            orderState: 'Completed',
            markedAsDoneByFreelancer: true,
            markedAsDoneByClient: true,
          },
        });
        const msg = await this.prisma.message.create({
          data: {
            sender: 'System',
            content: '# Order has been completed',
            chat: {
              connect: {
                id: client.handshake.query.chatId as string,
              },
            },
            type: 'Text',
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
          sender: 'System',
          type: 'Prompt',
          promptSender: data.role,

          content: `# ${user.name} wants to mark this order as completed. 
Marking this order as completed required consent of both parties. Are you sure you want to mark this as completed?`,
          chat: {
            connect: {
              id: client.handshake.query.chatId as string,
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
      data = verify(token, SIGN_SECRET) as DecodedJWT;
    } catch {
      client.emit('error', 'Invalid or Expired Authentication Token');
      return client.disconnect(true);
    }
    const orderStatus = await this.prisma.order.findFirst({
      where: {
        id: client.handshake.query.orderId as string,
      },
      select: {
        orderState: true,
        markedAsDoneByFreelancer: true,
        markedAsDoneByClient: true,
      },
    });
    if (!orderStatus) {
      return client.emit('error', 'Invalid order');
    }
    if (orderStatus.orderState === 'Completed') {
      return client.emit('error', 'Order is already completed');
    }
    const userInfo = await this.prisma.user.findFirst({
      where: {
        id: data.id,
      },
    });

    if (!userInfo) {
      return client.emit('error', 'Invalid user');
    }

    const message = await this.prisma.message.create({
      data: {
        sender: 'System',
        chat: {
          connect: {
            id: client.handshake.query.chatId as string,
          },
        },
        type: 'Text',
        content: `${userInfo.name} has rejected your proposal to mark this order as completed.`,
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
      },
    });
    client.emit('message', message);
    client
      .to(client.handshake.query.orderId as string)
      .emit('message', message);
  }
}
