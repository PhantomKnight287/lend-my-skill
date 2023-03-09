import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Token } from 'decorator/token/token.decorator';
import { UpdateProfileDTO } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@Token({ serialize: true }) { id }) {
    return await this.profileService.findUser(id);
  }
  @Post('update')
  async updateProfile(
    @Token({ serialize: true }) { id },
    @Body() body: UpdateProfileDTO,
  ) {
    return await this.profileService.updateUser(id, body);
  }

  @Get(':username')
  async getProfileByUsername(@Param('username') username: string) {
    return await this.profileService.getProfileByUsername(username);
  }
}
