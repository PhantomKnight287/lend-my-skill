import { Body, Controller, Headers, HttpCode, Post, Res } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { Response } from 'express';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('razorpay')
  @HttpCode(200)
  async razorpayWebhook(
    @Body() body: any,
    @Res() res: Response,
    @Headers('x-razorpay-signature') razorpaySignature: string,
  ) {
    res.status(200).send('ok');
    await this.webhookService.createOrder(body, razorpaySignature);
  }
}
