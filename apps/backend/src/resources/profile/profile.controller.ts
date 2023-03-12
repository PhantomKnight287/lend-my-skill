import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Token } from 'src/decorators/token/token.decorator';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { CompletedProfileDTO } from './dto/complete-profile.dto';
import { BodyWithUser } from 'src/types/body';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@Token({ serialize: true }) { id }) {
    return await this.profileService.findUser(id);
  }
  @Post('update')
  async updateProfile(@Body() body: BodyWithUser<UpdateProfileDTO>) {
    const { user, ...data } = body;
    return await this.profileService.updateUser(user.id, data);
  }

  @Get(':username')
  async getProfileByUsername(@Param('username') username: string) {
    return await this.profileService.getProfileByUsername(username);
  }

  @Post('complete')
  async completedProfile(@Body() body: BodyWithUser<CompletedProfileDTO>) {
    const { user } = body;
    return await this.profileService.completeProfile(user.id, body);
  }
}
