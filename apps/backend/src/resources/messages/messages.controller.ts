import { Controller, Get, Param, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(':id/count')
  async getMessagesCount(@Param('id') orderId: string) {
    return await this.messagesService.getMessagesCount(orderId);
  }
  @Get(':orderId')
  async getMessages(
    @Param('orderId') orderId: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return await this.messagesService.getMessages(orderId, skip, take);
  }
}
