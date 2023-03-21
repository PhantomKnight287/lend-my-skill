import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class Feature {
  @IsString()
  name: string;

  @IsString({ each: true })
  includedIn: string[];
}

export class Package {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsNumber()
  deliveryDays: number;
}

export class CreateServiceDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsString()
  bannerImage: string;

  @IsString({ each: true })
  images: string[];

  @IsString({ each: true })
  tags: string[];

  @ValidateNested({ each: true })
  @Type(() => Feature)
  features: Feature[];

  @ValidateNested({ each: true })
  @Type(() => Package)
  packages: Package[];
}
