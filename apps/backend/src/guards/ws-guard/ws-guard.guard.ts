import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { decodeJWT } from 'helpers/jwt';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class WsGuardGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const headers = context.switchToWs().getClient<Socket>().handshake.headers;
    console.log(headers.authorization)
    if (!headers.authorization)
      throw new WsException('Authorization header is missing');
    try {
      decodeJWT(headers.authorization.replace('Bearer ', ''), {
        data: { serialize: true },
      });
    } catch (err) {
      throw new WsException('Invalid or Expired Authentication Token');
    }
    return true;
  }
}
