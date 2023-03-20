import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-auth.dto';
import { LoginUserDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() createAuthDto: LoginUserDto) {
    return await this.authService.login(createAuthDto);
  }

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return await this.authService.create(body);
  }
}
