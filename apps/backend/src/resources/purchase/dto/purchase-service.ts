import { IsOptional, IsString } from 'class-validator';

export class PurchaseServiceDTO {
  @IsString()
  packageId: string;
  @IsString()
  @IsOptional()
  couponCode?: string;
}
