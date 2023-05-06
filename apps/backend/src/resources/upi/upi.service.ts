import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import Razorpay from 'razorpay';
import { RAZORPAY_KEY, RAZORPAY_SECRET } from 'src/constants';
import { TransactionType } from '@prisma/client';

console.log(Razorpay);

@Injectable()
export class UpiService {
  r = new Razorpay({
    key_id: RAZORPAY_KEY,
    key_secret: RAZORPAY_SECRET,
  });

  constructor(protected p: PrismaService) {}

  async generateOrderId(
    amount: number,
    type: TransactionType,
    notes: Record<any, any>,
  ) {
    const transaction = await this.p.transactions.create({
      data: {
        amount,
        status: 'Created',
        type,
        createdBy: {
          connect: {
            id: notes.userId,
          },
        },
      },
      select: {
        id: true,
      },
    });
    const { id } = await this.r.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: transaction.id,
      notes,
    });
    return {
      id,
    };
  }
}
