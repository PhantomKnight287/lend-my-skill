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
  confirmPassword: string;

  @IsString()
  country: string;

  @IsString()
  username: string;

  @IsEnum(Role)
  role: Role;

  @IsString()
  name: string;
}
