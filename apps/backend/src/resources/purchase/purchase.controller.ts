import { Body, Controller, Post } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseServiceDTO } from './dto/purchase-service';
import { BodyWithUser } from 'src/types/body';

@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  async purchaseAPackage(@Body() body: PurchaseServiceDTO) {
    const {
      user: { id },
      ...rest
    } = body as unknown as BodyWithUser<PurchaseServiceDTO>;
    return await this.purchaseService.purchaseService(id, rest);
  }
}
