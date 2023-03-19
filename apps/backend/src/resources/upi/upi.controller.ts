import { Body, Controller, Post } from '@nestjs/common';
import { BodyWithUser } from 'src/types/body';
import { CreateOrderidDto } from './dto/create-orderid.dto';
import { UpiService } from './upi.service';

// this will be used to generate orderId for razorpay
@Controller('upi')
export class UpiController {
  constructor(private readonly upiService: UpiService) {}

  @Post('verification')
  async generateOrderIdForUPIVerification(
    @Body() body: BodyWithUser<CreateOrderidDto>,
  ) {
    const { user, notes } = body;
    return await this.upiService.generateOrderId(1, 'UPIVerification', {
      ...notes,
      userId: user.id,
    });
  }
}
