import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail() email: string;

  @IsString()
  @MinLength(8)
  @IsStrongPassword()
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
