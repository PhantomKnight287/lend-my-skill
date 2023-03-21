import { IsArray, IsOptional, IsString } from 'class-validator';

export class CompletedProfileDTO {
  @IsArray()
  readonly documents: string[];

  @IsString()
  @IsOptional()
  paypalEmail?: string;

  @IsString()
  @IsOptional()
  upiId?: string;

  @IsString()
  mobileNumber: string;
}
