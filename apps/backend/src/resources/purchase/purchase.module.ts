import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { ConversionService } from 'src/services/conversion/conversion.service';
import { RazorpayService } from 'src/services/razorpay/razorpay.service';

@Module({
  controllers: [PurchaseController],
  providers: [
    PurchaseService,
    PrismaService,
    ConversionService,
    RazorpayService,
  ],
})
export class PurchaseModule {}
