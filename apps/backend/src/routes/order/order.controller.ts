import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { Token } from 'src/decorators/token/token.decorator';
import { razorpay } from 'src/modules/razorpay';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreateOrderDto } from 'src/validators/order.validator';
import axios from 'axios';
import { URLSearchParams } from 'url';

@Controller('order')
export class OrderController {
  constructor(protected prisma: PrismaService) {}
  @Post('create')
  async createOrder(
    @Body() body: CreateOrderDto,
    @Token({ serialize: true }) { id },
  ) {
    const { sellerUsername, packageId, discountCode } = body;
    const seller = await this.prisma.freelancer.findFirst({
      where: {
        username: {
          equals: sellerUsername,
          mode: 'insensitive',
        },
      },
    });
    if (!seller) {
      throw new HttpException('Seller not found', 404);
    }
    const buyer = await this.prisma.client.findFirst({
      where: {
        id,
      },
    });
    if (!buyer) {
      throw new HttpException('Buyer not found', 404);
    }
    const isSellerEligible = seller.profileCompleted || seller.kycCompleted;
    if (!isSellerEligible) {
      throw new HttpException('Seller is not eligible to recieve orders', 400);
    }
    const isBuyerEligible = buyer.profileCompleted || buyer.kycCompleted;
    if (!isBuyerEligible) {
      throw new HttpException('You are not eligible to place orders', 400);
    }
    const packageSelected = await this.prisma.package.findFirst({
      where: {
        id: packageId,
      },
      include: {
        gig: true,
      },
    });
    if (!packageSelected) {
      throw new HttpException('Package not found', 404);
    }
    const code = await this.prisma.discountCode.findFirst({
      where: {
        code: {
          equals: discountCode,
          mode: 'insensitive',
        },
      },
    });
    if (!code) throw new HttpException('Invalid Coupon Code.', 404);

    if (code.expiryDate < new Date()) {
      throw new HttpException('Coupon code expired.', 400);
    }
    let discount = 0;
    let discountPercentage = 0;
    if (code) {
      const order = await this.prisma.order.findFirst({
        where: {
          AND: [
            {
              DiscountCode: {
                code: {
                  equals: code.code,
                  mode: 'insensitive',
                },
              },
            },
            {
              client: {
                id: buyer.id,
              },
            },
          ],
        },
      });
      if (order) {
        throw new HttpException('Coupon code already used.', 400);
      }
      if (code.type === 'AMOUNT') {
        if (code.discountAmount > packageSelected.price) {
          throw new HttpException(
            'Coupon code discount is more than package price.',
            400,
          );
        }
        discount = code.discountAmount;
      } else if (code.type === 'PERCENTAGE') {
        discountPercentage = code.discountPercentage;
      }
    }

    const params = new URLSearchParams();
    let amountToPay = packageSelected.price;
    if (discountPercentage) {
      amountToPay =
        packageSelected.price -
        (packageSelected.price * discountPercentage) / 100;
    } else if (discount) {
      amountToPay = packageSelected.price - discount;
    }
    params.append('amount', amountToPay.toString());
    params.append('from', 'USD');
    params.append('to', 'INR');
    console.log(params.toString());
    const amount = await axios
      .get(`https://api.exchangerate.host/convert?${params.toString()}`, {
        headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
    if (!amount) {
      throw new HttpException('Something went wrong', 500);
    }
    const { result } = amount.data;

    // const order = await this.prisma.order.create({
    //   data: {
    //     deliveryDays: packageSelected.deliveryDays,
    //     price: packageSelected.price,
    //     client: {
    //       connect: {
    //         id: buyer.id,
    //       },
    //     },
    //     freelancer: {
    //       connect: {
    //         id: seller.id,
    //       },
    //     },
    //     gig: {
    //       connect: {
    //         id: packageSelected.gig.id,
    //       },
    //     },
    //     deadline: new Date(
    //       new Date().getTime() +
    //         packageSelected.deliveryDays * 24 * 60 * 60 * 1000,
    //     ),
    //     package: {
    //       connect: {
    //         id: packageSelected.id,
    //       },
    //     },
    //   },
    //   select: {
    //     id: true,
    //   },
    // });
    // return order;
    console.table({
      amount: Number(result) * 100,
      currency: 'INR',
    });
    const data = await razorpay
      .createOrder({
        amount: Math.round(Number(Number(result).toFixed(3)) * 100),
        currency: 'INR',
        notes: {
          sellerId: seller.id,
          buyerId: buyer.id,
          packageId: packageSelected.id,
          gigId: packageSelected.gig.id,
        },
        partialPayment: false,
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
    if (!data) {
      throw new HttpException('Something went wrong', 500);
    }
    return {
      id: data.id,
      amount: amountToPay.toString(),
      discounted: Boolean(discountPercentage || discount),
    };
  }
}
