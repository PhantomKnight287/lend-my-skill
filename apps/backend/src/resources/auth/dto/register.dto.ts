import { IsEmail, IsString } from 'class-validator';

export class RegisterDTO {
  @IsString()
  name: string;
  @IsString()
  password: string;
  @IsEmail()
  email: string;
  @IsString()
  username: string;
}
