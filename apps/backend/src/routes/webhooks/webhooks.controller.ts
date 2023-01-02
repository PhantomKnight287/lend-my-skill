import { Body, Controller, Headers, Post } from '@nestjs/common';
import { RAZORPAY_WEBHOOK_SECRET } from 'src/constants';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { RazorpayResponse } from 'src/types/razorpay-response';
/* eslint-disable */
const {
  validateWebhookSignature,
} = require('razorpay/dist/utils/razorpay-utils');
/* eslint-enable */

@Controller('webhooks')
export class WebhooksController {
  constructor(protected prisma: PrismaService) {}
  @Post('razorpay')
  async razorpayWebhook(
    @Body() body: RazorpayResponse,
    @Headers('X-Razorpay-Signature') razorpaySignature: string,
  ) {
    const { buyerId, discountCode, gigId, packageId, sellerId } =
      body.payload.payment.entity.notes;
    const data = validateWebhookSignature(
      JSON.stringify(body),
      razorpaySignature,
      RAZORPAY_WEBHOOK_SECRET,
    ) as boolean;
    if (!data) return true;
    const packageSelected = await this.prisma.package.findFirst({
      where: { id: packageId },
    });
    await this.prisma.order.create({
      data: {
        deliveryDays: packageSelected.deliveryDays,
        price: packageSelected.price,
        client: {
          connect: {
            id: buyerId,
          },
        },
        freelancer: {
          connect: {
            id: sellerId,
          },
        },
        gig: {
          connect: {
            id: gigId,
          },
        },
        deadline: new Date(
          new Date().getTime() +
            packageSelected.deliveryDays * 24 * 60 * 60 * 1000,
        ),
        package: {
          connect: {
            id: packageSelected.id,
          },
        },
        DiscountCode: discountCode
          ? {
              connect: {
                code: discountCode,
              },
            }
          : undefined,
        amountPaid: body.payload.payment.entity.amount / 100,
        paymentId: body.payload.payment.entity.id,
      },
      select: {
        id: true,
      },
    });
    return true;
  }
}
