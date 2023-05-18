import { HttpException, Injectable } from '@nestjs/common';
import { ConversionService } from 'src/services/conversion/conversion.service';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { PurchaseServiceDTO } from './dto/purchase-service';
import { DiscountType } from '@prisma/client';
import { RazorpayService } from 'src/services/razorpay/razorpay.service';

@Injectable()
export class PurchaseService {
  constructor(
    protected c: ConversionService,
    protected p: PrismaService,
    protected r: RazorpayService,
  ) {}

  async purchaseService(userId: string, body: PurchaseServiceDTO) {
    const { packageId, couponCode: c } = body;
    const packageData = await this.p.package.findFirst({
      where: {
        id: packageId,
      },
      include: {
        service: {
          select: {
            user: {
              select: {
                id: true,
                profileCompleted: true,
                kycCompleted: true,
              },
            },
          },
        },
      },
    });
    if (
      !packageData.service.user.profileCompleted ||
      !packageData.service.user.kycCompleted
    ) {
      throw new HttpException(
        "The freelancer isn't yet allowed to take orders.",
        400,
      );
    }
    const client = await this.p.user.findUnique({
      where: { id: userId },
    });
    if (!client.profileCompleted || !client.kycCompleted) {
      throw new HttpException(
        "You can't place orders until you complete your profile and KYC.",
        400,
      );
    }
    let discountMode: {
      type: DiscountType;
      value: number;
    } = undefined;
    if (!packageData) {
      throw new HttpException('Package not found', 404);
    }
    const notes = {
      createdBy: userId,
      packageId: packageId,
    };

    if (c) {
      const couponCode = await this.p.couponCode.findFirst({
        where: {
          code: {
            equals: c,
            mode: 'insensitive',
          },
        },
      });
      if (!couponCode) {
        throw new HttpException('Invalid coupon code', 400);
      }
      if (!couponCode.enabled) {
        throw new HttpException('Coupon code is disabled', 400);
      }
      const alreadyUsed = await this.p.couponCode.findFirst({
        where: {
          id: couponCode.id,
          orders: {
            some: {
              couponCodeId: couponCode.id,
            },
          },
        },
      });
      if (alreadyUsed) {
        throw new HttpException("You've already used this coupon code.", 400);
      }
      discountMode = {
        type: couponCode.type,
        value: couponCode.discount,
      };
      notes['couponCode'] = couponCode.id;
    }
    const conversionCharges = await this.c.getConversionRate('INR')!;
    let amount = packageData.price * conversionCharges;
    if (discountMode) {
      if (discountMode.type === 'Flat') {
        if (discountMode.value > amount) {
          throw new HttpException(
            'Discount amount is greater than the package price',
            400,
          );
        }
        amount -= discountMode.value;
      } else {
        amount -= (amount * discountMode.value) / 100;
      }
    }
    const t = await this.p.transactions.create({
      data: {
        amount: Math.round(amount * 100),
        status: 'Created',
        type: 'Payment',
        createdBy: {
          connect: {
            id: userId,
          },
        },
        paidTo: {
          connect: {
            id: packageData.service.user.id,
          },
        },
        gatewayOrderId: 'orderId',
      },
    });
    notes['transactionId'] = t.id;
    const order = await this.r.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      notes,
    });
    await this.p.transactions.update({
      where: {
        id: t.id,
      },
      data: {
        gatewayOrderId: order.id,
      },
    });

    return {
      orderId: order.id,
      amount: Math.round(amount * 100),
    };
  }
}
