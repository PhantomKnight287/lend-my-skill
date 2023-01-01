import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { razorpay } from 'src/modules/razorpay';

@Controller('upi')
export class UpiController {
  @Post('verify')
  async verifyUPIID(@Body('upiId') upiId: string) {
    if (!upiId) throw new HttpException('UPI ID is required', 400);
    const r = await razorpay.verifyUPIID(upiId);
    if (r.success === false)
      throw new HttpException('Unable to verify UPI ID', 400);
    return {
      success: true,
    };
  }
}
