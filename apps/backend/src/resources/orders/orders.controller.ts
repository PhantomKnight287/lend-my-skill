import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getOrders(@Query('take') take: string, @Body() body: any) {
    return await this.ordersService.getOrders(body.user.id, take);
  }

  @Get('detail/:id')
  async getOrderInfo(@Param('id') id: string) {
    return await this.ordersService.getOrderInfo(id);
  }
}
