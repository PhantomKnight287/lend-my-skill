import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Token } from 'src/decorators/token/token.decorator';
import { razorpay } from 'src/modules/razorpay';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreateOrderDto } from 'src/validators/order.validator';
import axios from 'axios';
import { URLSearchParams } from 'url';
import { DiscountCode } from '@prisma/client';
import { VerificationService } from 'src/services/verification/verification.service';

@Controller('order')
export class OrderController {
  constructor(
    protected prisma: PrismaService,
    protected verification: VerificationService,
  ) {}
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
    let code: DiscountCode = undefined;
    if (discountCode) {
      code = await this.prisma.discountCode.findFirst({
        where: {
          code: discountCode,
        },
      });
    }
    if (!code && body.discountCode)
      throw new HttpException('Invalid Coupon Code.', 404);

    if (code && code.expiryDate < new Date()) {
      throw new HttpException('Coupon code expired.', 400);
    }
    let discount = 0;
    let discountPercentage = 0;
    let discounted = false;
    if (code) {
      console.log(code);
      console.log('Code found');
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
        discounted = true;
      } else if (code.type === 'PERCENTAGE') {
        discountPercentage = code.discountPercentage;
        discounted = true;
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

    const data = await razorpay
      .createOrder({
        amount: Math.round(Number(Number(result).toFixed(3)) * 100),
        currency: 'INR',
        notes: {
          sellerId: seller.id,
          buyerId: buyer.id,
          packageId: packageSelected.id,
          gigId: packageSelected.gig.id,
          discountCode: code?.code,
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
      amount: Math.round(Number(Number(result).toFixed(3)) * 100),
      discounted: discounted,
    };
  }
  @Get('list')
  async listOrders(
    @Token({ serialize: true }) { id },
    @Query('take') take: string,
  ) {
    const toTake = Number.isNaN(parseInt(take)) ? 10 : parseInt(take);
    const { userFound: isValidClient } = await this.verification.verifyBuyer(
      id,
    );
    const { userFound: isValidFreelancer } =
      await this.verification.verifySeller(id);
    if (!isValidClient && !isValidFreelancer) {
      throw new HttpException(
        'No account found with associated token',
        HttpStatus.NOT_FOUND,
      );
    }
    const orders = await this.prisma.order.findMany({
      where: {
        OR: [
          {
            freelancer: {
              id,
            },
          },
          {
            client: {
              id,
            },
          },
        ],
      },
      select: {
        id: true,
        package: {
          select: {
            id: true,
            price: true,
            description: true,
            name: true,
          },
        },
        DiscountCode: {
          select: {
            code: true,
            type: true,
            discountAmount: true,
            discountPercentage: true,
          },
        },
        freelancer: {
          select: {
            username: true,
            id: true,
            name: true,
            verified: true,
            avatarUrl: true,
          },
        },
        client: {
          select: {
            username: true,
            id: true,
            name: true,
            verified: true,
            avatarUrl: true,
          },
        },
        deadline: true,
        price: true,
        createdAt: true,
        status: true,
      },
      take: toTake,
      skip: toTake > 10 ? toTake - 10 : undefined,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
    if (orders.length === 10) {
      return {
        orders,
        next: toTake + 10,
      };
    }
    return { orders };
  }
  @Get('details/:id')
  async getOrder(
    @Param('id') orderId: string,
    @Token({ serialize: true }) { id },
  ) {
    const { userFound: isValidClient } = await this.verification.verifyBuyer(
      id,
    );
    const { userFound: isValidFreelancer } =
      await this.verification.verifySeller(id);
    if (!isValidClient && !isValidFreelancer) {
      throw new HttpException(
        'No account found with associated token',
        HttpStatus.NOT_FOUND,
      );
    }
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        freelancer: isValidFreelancer ? { id } : undefined,
        client: isValidClient ? { id } : undefined,
      },
      select: {
        id: true,
        package: {
          select: {
            id: true,
            price: true,
            description: true,
            name: true,
            deliveryDays: true,
            gig: {
              select: {
                slug: true,
                freelancer: {
                  select: {
                    username: true,
                  },
                },
              },
            },
          },
        },
        DiscountCode: {
          select: {
            code: true,
            type: true,
            discountAmount: true,
            discountPercentage: true,
          },
        },
        freelancer: {
          select: {
            username: true,
            id: true,
            name: true,
            verified: true,
            avatarUrl: true,
          },
        },
        client: {
          select: {
            username: true,
            id: true,
            name: true,
            verified: true,
            avatarUrl: true,
          },
        },
        deadline: true,
        price: true,
        createdAt: true,
        status: true,
        amountPaid: true,
      },
    });
    if (!order)
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    return { ...order, user: isValidClient ? 'client' : 'freelancer' };
  }
}
