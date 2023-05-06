import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail() email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsString()
  username: string;

  @IsEnum(Role)
  @IsOptional()
  role: Role;

  @IsString()
  name: string;
}
