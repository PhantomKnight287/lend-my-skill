import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { decodeJWT } from 'helpers/jwt';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
export class MessageGateway implements OnGatewayConnection {
  handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
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
  }
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    console.log('message', payload);
    return 'Hello world!';
  }
}
