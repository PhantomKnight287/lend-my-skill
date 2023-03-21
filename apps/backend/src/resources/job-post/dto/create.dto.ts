import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateJobPostDTO {
  @IsString()
  @MaxLength(1000)
  @MinLength(20)
  title: string;

  @IsString()
  @MinLength(100)
  description: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsArray({ each: true })
  @MaxLength(5)
  tags: string[];

  @IsString()
  category: string;

  @IsArray({ each: true })
  images: string[];

  @IsString()
  @IsOptional()
  deadline: string;
}
