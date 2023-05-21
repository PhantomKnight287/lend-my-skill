import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils';
import { RazorpayWebhookResponse } from 'src/types/razorpay';
import { RAZORPAY_WEBHOOK_SECRET } from 'src/constants';

@Injectable()
export class WebhookService {
  constructor(protected p: PrismaService) {}

  async createOrder(body: RazorpayWebhookResponse, razorpaySignature: string) {
    if (
      validateWebhookSignature(
        JSON.stringify(body),
        razorpaySignature,
        RAZORPAY_WEBHOOK_SECRET,
      ) === false
    ) {
      return;
    }
    const { payload, event } = body;
    if (event != 'payment.captured') return;
    const { notes } = payload.payment.entity;
    const { packageId, createdBy, transactionId, couponCode } = notes;
    const packageInfo = await this.p.package.findUnique({
      where: {
        id: packageId,
      },
      include: {
        service: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    await this.p.transactions.update({
      where: {
        id: transactionId,
      },
      data: {
        order: {
          create: {
            orderState: 'Created',
            client: { connect: { id: createdBy } },
            couponCode: couponCode
              ? {
                  connect: {
                    id: couponCode,
                  },
                }
              : undefined,
            freelancer: {
              connect: {
                id: packageInfo.service.user.id,
              },
            },
            service: {
              connect: {
                id: packageInfo.service.id,
              },
            },
            chat: {
              create: {},
            },
            package: {
              connect: {
                id: packageId,
              },
            },
          },
        },
      },
    });
  }
}
