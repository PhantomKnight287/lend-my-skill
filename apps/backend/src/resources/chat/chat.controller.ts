import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Get(':id')
  async getChatInfo(@Param('id') orderId: string) {
    return await this.chatService.getChatInfo(orderId);
  }
}
